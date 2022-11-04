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
                'type': 'group_create_player',
                'event': 'create_player',
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo'],
                'x': data['x'],
                'y': data['y'],
            }
        )

    async def group_create_player(self, data):
        await self.send(text_data = json.dumps(data))


    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['event'] == 'create_player':
            await self.create_player(data)
