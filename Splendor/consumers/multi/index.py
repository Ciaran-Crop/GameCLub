from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from gameclub.views.common import get_state
import json
from asgiref.sync import sync_to_async

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer
from Splendor.match_service.src.splendor_match_service.splendor_match.ttypes import SplendorPlayer
from Splendor.match_service.src.splendor_match_service.splendor_match import SplendorMatch
from Splendor.models.player import SplendorPlayer as configPlayer

@sync_to_async
def op_player(email, channel_name, score, op):
    transport = TSocket.TSocket('127.0.0.1', 9091)
    transport = TTransport.TBufferedTransport(transport)
    protocol = TBinaryProtocol.TBinaryProtocol(transport)
    client = SplendorMatch.Client(protocol)
    transport.open()
    if op == 'add':
        client.add_player(SplendorPlayer(email, channel_name, score, 0), 'add_player')
    elif op == 'remove':
        client.remove_player(SplendorPlayer(email, channel_name, score, 0), 'remove_player')
    transport.close()

@sync_to_async
def get_info(email):
    player = configPlayer.objects.get(user__username = email)
    return {'email': email, 'score': player.score}

class MultiGameRoom(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.state = 'free'
        if self.user.is_authenticated:
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if self.state == 'match':
            content = await get_info(self.user.username)
            await self.stop_match(content)
        if hasattr(self, 'room_id') and self.room_id:
            await self.channel_layer.group_discard(self.room_id, self.channel_name)

    async def group_send_event(self, data):
        await self.send(text_data = json.dumps(data))

    async def group_send(self, content, event):
        await self.channel_layer.group_send(self.room_id, {
                'type': 'group_send_event',
                'event': event,
                'email':self.user.username,
                'content': content,
            })
    async def group_add(self):
        await self.channel_layer.group_add(self.room_id, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        event = data['event']
        content = data['content']
        if event == 'create_room':
            await self.create_room(content)
        elif event == 'join_room':
            await self.join_room(content)
        elif event == 'cancel_room':
            await self.cancel_room(content)
        elif event == 'start_game':
            await self.start_game(content)
        elif event == 'match':
            await self.match(content)
        elif event == 'stop_match':
            await self.stop_match(content)

    async def create_room(self, content):
        if self.state != 'free':
            return 0
        self.state = 'create'
        room_id = 'splendor-room_' + get_state()
        self.room_id = room_id
        await self.group_add()
        room_config = content['room_config']
        roomowner = content['room_owner']
        roomowner['game_score'] = 0
        room_config['room_player_number'] = int(room_config['room_player_number'][0])
        room_config['room_round_second'] = int(room_config['room_round_second'][:-1])
        room_content = {
            'config': room_config,
            'players': [roomowner],
        }
        self.password = room_config['room_pass']
        need_pass = 'false' if self.password == '' else 'true'
        cache.set(room_id, room_content, 4800)
        await self.group_send({'room_id': room_id, 'need_pass': need_pass, 'config': room_config}, 'create_room')

    async def cancel_room(self, content):
        await self.group_send({'cancel': 'true'}, 'cancel_room')
        cache.delete(self.room_id)
        self.room_id = ''

    async def start_game(self, content):
        await self.group_send({'start': 'true'}, 'start_game')

    async def join_room(self, content):
        if self.state != 'free' and self.state != 'match':
            return 0
        room_id = content['room_id']
        passwd = content['pass']
        player_info = content['player_info']
        player_info['game_score'] = 0
        if len(cache.keys(room_id)):
            if passwd == cache.get(room_id)['config']['room_pass']:
                if cache.get(room_id)['config']['room_player_number'] > len(cache.get(room_id)['players']):
                    room = cache.get(room_id)
                    for pr in room['players']:
                        if pr['email'] == player_info['email']:
                            return 0
                    self.state = 'join'
                    self.room_id = room_id
                    room['players'].append(player_info)
                    cache.set(room_id, room, 4800)
                    if content.get('match', 'false') == 'false':
                        await self.group_add()
                    if content.get('match', 'false') == 'false':
                        await self.group_send({'config': room['config'], 'players': room['players'], 'match': 'false'}, 'join_room')
                    else:
                        await self.group_send({'config': room['config'], 'players': room['players'], 'match': 'true', 'room_id': room_id}, 'join_room')

    async def match(self, content):
        if self.state == 'free':
            self.state = 'match'
            await op_player(content['email'], self.channel_name, content['score'], 'add')

    async def stop_match(self, content):
        if self.state == 'match':
            self.state = 'free'
            await op_player(content['email'], self.channel_name, content['score'], 'remove')


