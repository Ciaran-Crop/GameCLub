from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.core.cache import cache

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

from match_service.src.match_server.match_service import Match
from match_service.src.match_server.match_service.ttypes import Player as MatchPlayer
from game.models.player import Player
from channels.db import database_sync_to_async

ROOM_CAPATICY = 3

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_authenticated:
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if hasattr(self, 'room-name') and self.room_name:
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
       # Make socket
        transport = TSocket.TSocket('127.0.0.1', 9090)

        # Buffering is critical. Raw sockets are very slow
        transport = TTransport.TBufferedTransport(transport)

        # Wrap in a protocol
        protocol = TBinaryProtocol.TBinaryProtocol(transport)

        # Create a client to use the protocol encoder
        client = Match.Client(protocol)

        # Connect!
        transport.open()

        self.room_name = None
        self.uuid = data['uuid']

        def get_player_from_db():
            return Player.objects.get(user__username=data['username'])

        player = await database_sync_to_async(get_player_from_db)()

        score = player.score

        client.add_player(MatchPlayer(uuid=data['uuid'], username=data['username'], channel_name=self.channel_name, score=score, waiting_time = 0, x=data['x'], y = data['y'], photo=data['photo']))

        transport.close()


    async def attack(self,data):
        if not self.room_name:
            return

        players = cache.get(self.room_name)

        if not players:
            return

        attackee_uuid = data['attackee_uuid']
        for pr in players:
            if pr['uuid'] == attackee_uuid:
                pr['hp'] -= 25

        remain_cnt = 0
        for pr in players:
            if pr['hp'] > 0:
                remain_cnt += 1
        if remain_cnt > 1:
            if self.room_name:
                cache.set(self.room_name, players, 3600)
        else:
            def update_score(username, score):
                player = Player.objects.get(user__username=username)
                player.score += score
                player.save()
            for pr in players:
                if pr['hp'] <= 0:
                    await database_sync_to_async(update_score)(pr['username'], -5)
                else:
                    await database_sync_to_async(update_score)(pr['username'], 10)

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

    async def send_message(self, data):
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'group_send_event',
                'event': 'send_message',
                'uuid': data['uuid'],
                'text': data['text'],
                'username': data['username'],
            }
        )

    async def group_send_event(self, data):
        if not self.room_name:
            keys = cache.keys("*{}*".format(self.uuid))
            if keys:
                self.room_name = keys[0]

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
        elif data['event'] == 'send_message':
            await self.send_message(data)
