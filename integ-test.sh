### Integration Test
echo "Entering integration tests - $(date) "
curl ipecho.net/plain

sleep 60
AA=$(docker run --net integration_default --link integration_cf-show-nodejs_1:cf-show-nodejs alpine:latest wget -q -O - cf-show-nodejs:3000/plain)
echo "lastRequestDate from the service: $AA "

BB=$(docker run --net integration_default --link integration_consul_1:consul alpine:latest wget -q -O - consul:38500/v1/kv/lastRequestDate | sed 's/^.*"Value":"\(.*\)",.*$/\1/g' | base64 -d)
echo "lastRequestDate from the consul: $BB "
sleep 60
[[ $AA == $BB ]] && echo "OK"