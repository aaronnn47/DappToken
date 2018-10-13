App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokenSold: 0,
    tokensAvailable: 750000,

    init: function(){
        console.log('App initialized...')
        return App.initWeb3()
    },
    initWeb3: function(){
        if (typeof web3 !== 'undefined') {

            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider);
          } else {
            // Set the provider you want from Web3.providers
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
            web3 = new Web3(App.web3Provider)
          }
          return App.initContracts()
    },
    initContracts: function(){
        $.getJSON('DappTokenSale.json',function(dappTokenSale){
            App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
            App.contracts.DappTokenSale.setProvider(App.web3Provider)
            App.contracts.DappTokenSale.deployed().then(function(dappTokenSale){
                console.log('Dapp token sale address: ', dappTokenSale.address)
            })
        })
        .done(function(){
                $.getJSON('DappToken.json',function(dappToken){
                    App.contracts.DappToken = TruffleContract(dappToken);
                    App.contracts.DappToken.setProvider(App.web3Provider)
                    App.contracts.DappToken.deployed().then(function(dappToken){
                        console.log('Dapp token address: ', dappToken.address)
                })
                App.listenForEvents()
                return App.render()
            })
        })
    },
    //listen for events emitted from the contract
    listenForEvents: function(){
        App.contracts.DappTokenSale.deployed().then(function(instance){
            instance.Sell({},{
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function(error,event){
                console.log('event triggered', event)
                App.render()
            })
        })
    }, 

    render: function(){
        if(App.loading){
            return;
        }
        App.loading = true;
         
        var loader = $('#loader')
        var content = $('#content')

        loader.show()
        content.hide()

        // load account data
        web3.eth.getCoinbase(function(err,account){
            if(err === null){
                console.log('account', account)
                App.account = account;
                $('#accountAddress').html('Your Account ' + account)
            }
        })
        // load token sale contract
        App.contracts.DappTokenSale.deployed().then(function(instance){
            dappTokenSaleInstance = instance;
            return dappTokenSaleInstance.tokenPrice()
        }).then(function(tokenPrice){
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber())
            return dappTokenSaleInstance.tokensSold()
        }).then(function(tokenSold){
            App.tokenSold = tokenSold.toNumber()
            $('.tokens-sold').html(App.tokenSold)
            $('.tokens-available').html(App.tokensAvailable)

            var progressPercent = (Math.ceil(App.tokenSold) / App.tokensAvailable) * 100
            $('#progress').css('width', progressPercent + '%')

            // load token contract
            App.contracts.DappToken.deployed().then(function(instance){
                dappTokenInstance = instance;
                return dappTokenInstance.balanceOf(App.account)
            }).then(function(balance){
                $('.dapp-balance').html(balance.toNumber())

                App.loading = false;
                loader.hide()
                content.show()        
            })
        })
    },

    buyTokens: function(){
        $('#content').hide()
        $('#loader').show()

        var numberOfTokens = $('#numberOfToken').val();
        App.contracts.DappTokenSale.deployed().then(function(instance){
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000
            })
        }).then(function(result){
            console.log('Tokens bought...')
            $('form').trigger('reset') // reset number of tokens in form
            //wait for sell event
        })
    }
}

$(function(){
    $(window).load(function(){
        App.init()
    })
})