#!/bin/bash

docker build -t neutrino-explorer .
docker run -itd --name neutrino-explorer -p 6000:8001 neutrino-explorer
