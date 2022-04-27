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
  TouchableOpacity,
  ImageBackground
} from 'react-native';

import CardStack, { Card } from 'react-native-card-stack-swiper';
import { Col, Row, Grid } from "react-native-easy-grid";

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

const StockDetails: () => Node = ({stock}) => {
  const headers = {
    regularMarketPrice: 'Market Price',
    regularMarketDayHigh: 'Day High',
    regularMarketDayLow: 'Day Low',
    fiftyDayAverage: '50 Day Avg',
    fiftyDayAverageChange: '50 Day Avg Change',
    twoHundredDayAverage: '200 Day Avg',
    twoHundredDayAverageChange: '200 Day Avg Change',
  }
  return (
    <View style={styles.cardDetails}>
      <Grid>
        {Object.keys(headers).map((key) => 
          <Row>
            <Col><Text style={styles.cardDetailsTitle}>{headers[key]}</Text></Col>
            <Col><Text style={styles.cardDetailsData}>{stock[key].toFixed(2)}</Text></Col>
          </Row>
        )}
      </Grid>
    </View>
  )
}

const StockCard: () => Node = ({stock}) => {
  const colorScheme = useColorScheme();

  return (
    <ImageBackground style={styles.cardLogo} source={{uri: stock.logo}}>
        <Card style={[styles.card]}>
          <Grid>
            <Row>
              
              <View style={styles.cardText}>
                <Text style={styles.cardSymbol}>{stock.symbol}</Text>
                <Text style={styles.cardCompanyName}>{stock.shortName}</Text>
              </View>
            </Row>
            <Row>
              
              <View style={[{height: 350}]}>
                <StockPriceDifference stock={stock} />
                <StockDetails stock={stock} />
              </View>
            </Row>
          </Grid>
        </Card>
      </ImageBackground>
  );

}


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const swiper = React.useRef(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <CardStack
        loop
        style={styles.content}
        ref={swiper}
        renderNoMoreCards={() => <Text style={{ fontWeight: '700', fontSize: 18, color: 'gray' }}>No more cards :(</Text>}
        onSwiped={() => console.log('onSwiped')}
        onSwipedLeft={() => console.log('onSwipedLeft')}
      >
        {stocks.map(stock => <StockCard key={stock.symbol} stock={stock} />)}
      </CardStack>
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.red]} onPress={() => {
                swiper.current.swipeLeft();
              }}>
                <Text style={{fontSize: 30}}>👎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.orange]} onPress={() => {
                swiper.current.goBackFromLeft();
              }}>
                <Text style={{top: -3, color: 'black', fontSize: 30, fontWeight: '800'}}>↺</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.green]} onPress={() => {
                swiper.current.swipeRight();
              }}>
                <Text style={{fontSize: 30}}>👍</Text>
              </TouchableOpacity>
        </View>
      </View>
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
  cardDetails: {
    width: 320,
    height: 180,
    padding: 10,
  },
  cardDetailsTitle: {
      fontWeight: '700',
      color: '#fff',
  },
  cardDetailsData: {
    color: '#eee',
    textAlign: 'right'
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
    padding: 10,
    textAlign: 'right',
    fontSize: 24,
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
