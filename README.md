# Pace
기존 프로젝트 유지보수



[가상 환경 설치 및 생성]
```
# virtualenv 설치
$ pip3 install virtualenv virtualenvwrapper

# 가상 환경 생성
$ python3 -m virtualenv django_pace

# 가상 환경 접속
$ source django_pace/bin/activate

# 가상 환경 종료
$ deactivate
```



[가상환경 설정]
```
# 가상 환경 접속
$ source django_pace/bin/activate

# 프로젝트 관련 모듈 및 장고 설치
# 아래 관련 모듈은 꼭 순서대로 설치(에러 발생할 수도 있음)
# 관련 모듈 - channels, cmake, opencv-python, opencv-contrib-python, dlib, face_recognition
$ pip install [모듈이름]

# PIL(Python Image Library)
$ pip install image
$ pip install pillow

$ pip install django

```



[local website 열기]

```
# 가상 환경 접속
$ source django_pace/bin/activate

# 프로젝트 폴더로 이동
$ cd 프로젝트 폴더 경로

# 프로젝트 실행
$ python3 manage.py runserver
```

