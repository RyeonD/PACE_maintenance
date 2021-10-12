from channels.routing import ProtocolTypeRouter, URLRouter
import home.routing
application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': URLRouter(
            home.routing.websocket_urlpatterns
        )
})