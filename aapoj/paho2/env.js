var env={
   "portforward": {
     "appid": "tauth_pf",
     "cbPath": "#registered",
    "url": {
      "soauth": "http://71.192.254.240:7080",
      "api": "http://71.192.254.240:3332/api",
      "spa": "http://71.192.254.240/spas/admind/dist/#",
      "base": "http://71.192.254.240/spas"
    }
   },
   "local": {
     "appid": "pahoRawLo",
     "cbPath": "",
     "ssl": false,
    "url": {
      "mqtt_server": "10.0.1.100",
      "mqtt_port": 3333,
      "soauth": "http://10.0.1.100:7080",
      "api": "http://10.0.1.100:3332/api",
      "spa": "http://10.0.1.100/spas/aapoj/paho2/index.html",
      "base": "http://10.0.1.100/spas/aapoj/paho2/index.html"
    }
   },
   "sb": {
     "appid": "pahoRawSB",
     "cbPath": "",
     "ssl": true,
    "url": {
      "mqtt_server": "services.sitebuilt.net/iotb/wss",
      "mqtt_port": 4333,
      "soauth": "https://services.sitebuilt.net/soauth/",
      "api": "https://services.sitebuilt.net/iotex/api"
    }
   },
   "pv": {
    "appid": "pahoRawSB",
    "cbPath": "",
    "ssl": true,
   "url": {
     "mqtt_server": "services.parleyvale.com/iotb/wss",
     "mqtt_port": 4333,
     "soauth": "https://services.parleyvale.com/soauth/",
     "api": "https://services.parleyvale.com/iotex/api"
   }
  },
   "http": {
     "appid": "tauth_ht",
     "cbPath": "#registered",
    "url": {
      "soauth": "http://162.217.250.109:7080",
      "api": "http://71.192.254.240:3332/api",
      "spa": "http://71.192.254.240/spas/admind/dist/#",
      "base": "http://71.192.254.240/spas"
    }
   },
   "https": {
     "appid": "tauth_hs",
     "cbPath": "#registered",
    "url": {
      "soauth": "https://services.sitebuilt.net/soauth",
      "api": "http://71.192.254.240:3332/api",
      "spa": "http://71.192.254.240/spas/admind/dist/#",
      "base": "http://71.192.254.240/spas"
    }
   },
   "production": {
     "appid": "tauth",
     "cbPath": "#registered",
    "url": {
      "soauth": "https://services.sitebuilt.net/soauth",
      "api": "https://services.sitebuilt.net/iotex/api",
      "spa": "http://71.192.254.240/spas/admind/dist/#",
      "base": "http://71.192.254.240/spas"
    }
   }
}
