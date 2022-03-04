import request from '@/utils/request'
export const getRank = () => request.get('/rank.json')
export const getSeller = () => request.get('/seller.json')
export const getData = data => request.get(`/${data}.json`)
