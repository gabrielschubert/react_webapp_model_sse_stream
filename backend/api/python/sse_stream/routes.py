from flask import jsonify, Blueprint, request, Response
from flask_jwt_extended import jwt_required, current_user

from api import feedback
# from api.python.models import User

sse_stream = Blueprint("sse_stream", __name__)


# @sse_stream.route('/ping')
# def ping():
#     print(feedback.epics_pvs)
#     msg = format_sse(data=feedback.epics_pvs)
#     announcer.announce(msg=msg)
#     return {}, 200


@sse_stream.route('/listen', methods=['GET'])
def listen():

    def stream():
        messages = feedback.announcer.listen()  # returns a queue.Queue
        while True:
            msg = messages.get()  # blocks until a new message arrives
            yield msg

    return Response(stream(), mimetype='text/event-stream')
