/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { stocks } from './mockData';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  ImageBackground
} from 'react-native';

import CardStack, { Card } from 'react-native-card-stack-swiper';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const StockPriceDifference: () => Node = ({stock}) => {
  let  { regularMarketChange, regularMarketChangePercent} = stock;
  
  if (regularMarketChange > 0) {
    return <Text style={[{color: '#8f8'}, styles.cardPrice]}>▲ {regularMarketChange.toFixed(2)} ({regularMarketChangePercent.toFixed(2)}%)</Text>;
  }
  else {
    return <Text style={[{color: 'red'}, styles.cardPrice]}>▼ {regularMarketChange.toFixed(2)} ({regularMarketChangePercent.toFixed(2)}%)</Text>;
  }
}

const StockCard: () => Node = ({stock}) => {
  const colorScheme = useColorScheme();

  return (
    <ImageBackground style={styles.cardLogo} source={{uri: stock.logo}}>
        <Card style={[styles.card]}>
              <View style={[{height: 350}]}>
                <StockPriceDifference stock={stock} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardSymbol}>{stock.symbol}</Text>
                <Text style={styles.cardCompanyName}>{stock.shortName}</Text>
              </View>
        </Card>
      </ImageBackground>
  );

}


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <CardStack
        loop
        style={styles.content}
        renderNoMoreCards={() => <Text style={{ fontWeight: '700', fontSize: 18, color: 'gray' }}>No more cards :(</Text>}
        onSwiped={() => console.log('onSwiped')}
        onSwipedLeft={() => console.log('onSwipedLeft')}
      >
        {stocks.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
      </CardStack>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
  },
  content:{
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 66,
    height: 58,
  },
  card:{
    width: 320,
    height: 470,
    borderColor: '#333',
    backgroundColor:'#000000a0',
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity:1,
  },
  cardLogo: {
    width: 320,
    height: 470,
    textAlignVertical: 'center',
    overflow: 'hidden',
    borderColor: '#333',
    tintColor: "#000000",
    borderRadius: 10,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity:1,
  },
  cardText: {
    padding: 10,
    height: 120,
    backgroundColor: 'transparent',
  },
  cardSymbol: {
    opacity: 1,
    lineHeight: 70,
    textAlign: 'left',
    fontSize: 40,
    fontFamily: 'System',
    color: '#fff',
    backgroundColor: 'transparent',
  },
  cardPrice: {
    opacity: 1,
    paddingLeft: 20,
    lineHeight: 70,
    textAlign: 'left',
    fontSize: 30,
    fontFamily: 'System',
    backgroundColor: 'transparent',
  },
  cardCompanyName: {

    lineHeight: 30,
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'System',
    color: '#fff',
    backgroundColor: 'transparent',
  },

  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
  },
  footer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonContainer:{
    width:220,
    flexDirection:'row',
    justifyContent: 'space-between',
  },
  button:{
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity:0.5,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    zIndex: 0,
  },
  orange:{
    width:55,
    height:55,
    borderWidth:6,
    borderColor:'rgb(246,190,66)',
    borderRadius:55,
    marginTop:-15
  },
  green:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#01df8a',
  },
  red:{
    width:75,
    height:75,
    backgroundColor:'#fff',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#fd267d',
  }
});

export default App;
