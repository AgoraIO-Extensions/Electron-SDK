nohup node __tests__/utils/peer.js $1 $2 &> peer.log&
# nohup node __tests__/utils/peer.js &
echo $! > peer.pid