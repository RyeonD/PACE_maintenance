from django.contrib import admin
from django.urls import path 
from home import views
 
urlpatterns = [
    path('', views.index, name='index'),
    path('call_pop', views.call_pop, name='call_pop'),
    path('call_cam', views.call_cam, name='call_cam'),
    path('open_img', views.open_img, name='open_img'),
   # path('get_name', views.get_name, name='get_name'),
    path('Chistory', views.Chistory.as_view(), name='Chistory'),
    path('Store', views.Store.as_view(), name='Store'),
    path('Shistory', views.Shistory.as_view(), name='Shistory'),
    path('Custom', views.Custom.as_view(),name='Custom'),
    path('test', views.test, name="test"),
]