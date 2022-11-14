#! /usr/bin/env python3
import glob
import sys
sys.path.insert(0, glob.glob('../../')[0])

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from match_server.match_service import Match
from match_server.match_service.ttypes import Player
from queue import Queue
from threading import Thread
from time import sleep

from acapp.asgi import channel_layer
from asgiref.sync import async_to_sync
from django.core.cache import cache

queue = Queue()

class Pool:
    def __init__(self):
        self.players = []

    def match(self):
        while len(self.players) >= 3:
            self.players = sorted(self.players, key=lambda pr: pr.score)
            flag = False
            for i in range(len(self.players) - 2):
                pr1, pr2, pr3 = self.players[i], self.players[i+1], self.players[i+2]
                if self.check_match(pr1,pr2) and self.check_match(pr1, pr3) and self.check_match(pr2,pr3):
                    self.match_success([pr1,pr2,pr3])
                    self.players = self.players[:i] + self.players[i+3:]
                    flag = True
                    break
            if not flag:
                break

        self.increase_waiting()

    def check_match(self, pr1, pr2):
        dis = abs(pr1.score - pr2.score)
        pr1_max_dis = pr1.waiting_time * 50
        pr2_max_dis = pr2.waiting_time * 50
        return dis <= pr1_max_dis and dis <= pr2_max_dis

    def match_success(self, mplayers):
        print("match success: ",[player.username for player in mplayers])
        room_name = "room-" + "-".join([player.uuid for player in mplayers])
        players = []
        for pr in mplayers:
            async_to_sync(channel_layer.group_add)(room_name, pr.channel_name)
            players.append({
                'uuid': pr.uuid,
                'username': pr.username,
                'photo': pr.photo,
                'hp': 100,
                'x': pr.x,
                'y': pr.y,
                })

        cache.set(room_name, players, 3600)

        for pr in mplayers:
            async_to_sync(channel_layer.group_send)(
                room_name,
                {
                    'type': 'group_send_event',
                    'event': 'create_player',
                    'uuid': pr.uuid,
                    'username': pr.username,
                    'x': pr.x,
                    'y': pr.y,
                    'photo': pr.photo,
                }
            )

    def increase_waiting(self):
        for player in self.players:
            player.waiting_time += 1

    def add_player(self, pr):
        self.players.append(pr)



class MatchHandler:
    def add_player(self, player):
        print("add player {} {} ".format(player.username, player.score))
        queue.put(player)
        return 0

def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None

def worker():
    pool = Pool()
    while True:
        player = get_player_from_queue()
        if player:
            pool.add_player(player)
        else:
            pool.match()
            sleep(1)


if __name__ == '__main__':
    handler = MatchHandler()
    processor = Match.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    Thread(target=worker, daemon=True).start()

    print('Starting the server...')
    server.serve()
    print('done.')
