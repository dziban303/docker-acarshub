#!/bin/bash

ADDITIONAL_OPTIONS=()

if [[ -n "${DB}" ]]; then
  ADDITIONAL_OPTIONS+=("ACARSHUB_DB=${DB}")
else
  ADDITIONAL_OPTIONS+=("ACARSHUB_DB=sqlite:////Users/fred/acarsdb.sqlite")
fi

if [[ -n "${DATA_SOURCE}" ]]; then
  ADDITIONAL_OPTIONS+=("LIVE_DATA_SOURCE=${DATA_SOURCE}")
else
  ADDITIONAL_OPTIONS+=("LIVE_DATA_SOURCE=192.168.31.199")
fi

if [[ -n "${NOADSB}" ]]; then
  ADDITIONAL_OPTIONS+=("ENABLE_ADSB=true" "ADSB_BYPASS_URL=true" "ADSB_URL=http://192.168.31.199:8081/data/aircraft.json")
fi

pushd ../rootfs/webapp/ || exit 1

env LOCAL_TEST=True ENABLE_ACARS=external ENABLE_VDLM=external \
  QUIET_MESSAGES=true MIN_LOG_LEVEL=3 \
  "${ADDITIONAL_OPTIONS[@]}" \
  python3 acarshub.py
