from django.conf.urls import url
from . import consumers

websocket_urlpatterns = [
    #re_path(r'ws/test/ (?P<username>.*)/', consumers.UserTestConsumer),
    url(r'^ws/test/(?P<username>[^/]+)/$', consumers.UserTestConsumer),
]