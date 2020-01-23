#!/bin/sh
scp -r ./heat root@sitebuilt.net:/home/iot/public_html/v3
scp -r ./heat/* root@parleyvale.com:/home/hvac/public_html/
scp -r ./heat/ root@parleyvale.com:/home/iot/public_html/

