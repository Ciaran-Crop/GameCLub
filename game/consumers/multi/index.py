from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache

ROOM_CAPATICY = 3

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = None
        for i in range(1000):
            name = "room-{}".format(i)
            if not cache.has_key(name) or len(cache.get(name)) < ROOM_CAPATICY:
                self.room_name = name
                break
        if not self.room_name:
            return

        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600)

        await self.accept()
        print('accept')

        for player in cache.get(self.room_name):
            await self.send(text_data = json.dumps({
                'event': 'create_player',
                'uuid': player['uuid'],
                'x': player['x'],
                'y': player['y'],
                'username': player['username'],
                'photo': player['photo'],
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)


    async def move_to(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'event': data['event'],
            }
        )

    async def shoot_fireball(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'shoot_fireball',
                'uuid': data['uuid'],
                'ball_uuid': data['ball_uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
            }
        )


    async def create_player(self, data):
        players = cache.get(self.room_name)
        players.append({
            'uuid': data['uuid'],
            'username': data['username'],
            'x': data['x'],
            'y': data['y'],
            'photo': data['photo'],
        })
        cache.set(self.room_name, players, 3600)

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'create_player',
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo'],
                'x': data['x'],
                'y': data['y'],
            }
        )
    async def attack(self,data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'attack',
                'uuid': data['uuid'],
                'x': data['x'],
                'y': data['y'],
                'damage' : data['damage'],
                'angle': data['angle'],
                'ball_uuid': data['ball_uuid'],
                'attackee_uuid': data['attackee_uuid'],
            }
        )

    async def blink(data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'blink',
                'uuid': data['uuid'],
                'tx': data['tx'],
                'ty': data['ty'],
                'skill_uuid': data['skill_uuid'],
            }
        )

    async def group_send_event(self, data):
        await self.send(text_data = json.dumps(data))


    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        if data['event'] == 'create_player':
            await self.create_player(data)
        elif data['event'] == 'move_to':
            await self.move_to(data)
        elif data['event'] == 'shoot_fireball':
            await self.shoot_fireball(data)
        elif data['event'] == 'attack':
            await self.attack(data)
        elif data['event'] == 'blink':
            await self.blink(data)
