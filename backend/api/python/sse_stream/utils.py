
import epics
import time
import queue


class feedbackThread(object):
    def __init__(
        self,
        pvs
    ):
        self.announcer = MessageAnnouncer()
        self.pvs = pvs
        self.epics_pvs = {}
        self.pvdata = {}
        for pv in self.pvs:
            epics_object = epics.PV(pv["pv"])
            self.epics_pvs[pv["pv"]] = {
                "object": epics_object,
            }
            self.pvdata[pv["pv"]] = {
                "value": epics_object.get(),
                "desc": pv["desc"],
                "type": pv["type"]
            }
        print(self.epics_pvs)

    def run(self):
        while True:
            for pv in self.pvs:
                self.pvdata[pv["pv"]
                            ]["value"] = self.epics_pvs[pv["pv"]]["object"].get()
            msg = format_sse(data=self.pvdata)
            self.announcer.announce(msg=msg)
            time.sleep(.1)


class MessageAnnouncer:

    def __init__(self):
        self.listeners = []

    def listen(self):
        q = queue.Queue(maxsize=5)
        self.listeners.append(q)
        return q

    def announce(self, msg):
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]


def format_sse(data: str, event=None) -> str:
    msg = f'data: {data}\n\n'
    if event is not None:
        msg = f'event: {event}\n{msg}'
    return msg
