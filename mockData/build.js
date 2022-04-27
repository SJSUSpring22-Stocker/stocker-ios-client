let axios = require('axios')
let fs = require('fs')


let getTrendingTickers = async (count = 100) => {
    let res = await axios.get(`https://query2.finance.yahoo.com/v1/finance/trending/US?count=${count}`)
    return res.data.finance.result[0].quotes.map(quote => quote.symbol)
}

let getSymbolRecommendations = async (symbol) => {
    let res = await axios.get(`https://query2.finance.yahoo.com/v6/finance/recommendationsbysymbol/${symbol}`)
    return res.data.finance.result[0].recommendedSymbols
}

let getSymbolInfo = async (symbol) => {
    let res = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`)
    return res.data.quoteResponse.result[0]
}

let main = async () => 
{
    let tickers = await getTrendingTickers()
    let info = await Promise.all(tickers.map(async (ticker) => {
        return await getSymbolInfo(ticker)
    }))
    console.log(JSON.stringify(info))
}

// node mockData/build > stock_info.json



main();