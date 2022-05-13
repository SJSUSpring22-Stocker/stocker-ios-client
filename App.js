/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import LoginScreen, { SocialButton } from "react-native-login-screen";
import axios from 'axios'
import { stocks } from './mockData';

const network = axios.create({
  baseURL: 'http://10.0.2.2:8080',
})

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

const StockPriceDifference = ({stock}) => {
  let  { regularMarketChange, regularMarketChangePercent} = stock;
  
  if (regularMarketChange > 0) {
    return <Text style={[{color: '#8f8'}, styles.cardPrice]}>▲ {regularMarketChange.toFixed(2)} ({regularMarketChangePercent.toFixed(2)}%)</Text>;
  }
  else {
    return <Text style={[{color: 'red'}, styles.cardPrice]}>▼ {regularMarketChange.toFixed(2)} ({regularMarketChangePercent.toFixed(2)}%)</Text>;
  }
}

const StockDetails = ({stock}) => {
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
          <Row key={key}>
            <Col><Text style={styles.cardDetailsTitle}>{headers[key]}</Text></Col>
            <Col><Text style={styles.cardDetailsData}>{stock[key].toFixed(2)}</Text></Col>
          </Row>
        )}
      </Grid>
    </View>
  )
}

const StockCard = ({stock}) => {
  const colorScheme = useColorScheme();

  return (
    <ImageBackground style={styles.cardLogo} source={{uri: stock.logo.toString()}}>
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

const LoginView = (props) => {

  // const [username, setUsername ] = useState('');
  // const [password, setPassword] = useState('');

  let username = '';
  let pass = '';

  return <LoginScreen
    onLoginPress={async () => {
        let res = await network.post('/api/v1/auth', {user: username, password: pass});
        if (res.status != 200) {
          // TODO: error condition
        }
        else {
          props.onLogin(res.data)
        }
    }}
    onHaveAccountPress={() => {}}
    onEmailChange={(email) => {username = email}}
    onPasswordChange={(password) => {pass = password}}
  ></LoginScreen>
}

const getStocks = async (setStocks) => {
    let res = await network.get('/api/v1/stock');
    if (res.status != 200) {
      setStocks(false);
      setTimeout(() => {
        setStocks(null);
      }, 2000);
    } 
    else {
      setStocks(res.data);
    }
}


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [userData, setUserData ] = useState(null);
  const swiper = React.useRef(null);


  const onSwiped = async (index, liked) => {
    let stock = stocks[index];

    if (liked) {
      // decrease user budget
      setUserData({...userData, budget: userData.budget - stock.regularMarketPrice})
    }
    try {
      let res = await network.post('/api/v1/selection', {
        user: userData.id,
        Stock: stock.symbol,
        Price: stock.regularMarketPrice,
        Change: stock.regularMarketChange,
        liked: liked
      })
    }
    catch (err) {
      console.error(err.response)
    }
  }
  
  if (userData == null)
    return <LoginView onLogin = {(user) => setUserData(user)} />;


  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ height: 50, flex:1,elevation: 10, shadowColor: '#222'}}>
        <Grid>
          <Col size ={50} style={{padding: 5}}>
            <Text style={styles.headerName}>Hello, {userData.name}</Text>
            <Text style={styles.headerBudget}>Budget: ${userData.budget.toFixed(2)}</Text>
          </Col>
          <Col size={35} style={{padding: 5}}>
          <TouchableOpacity style={[styles.button, styles.logout]} onPress={() => {
                setUserData(null);
              }}>
                <Text style={{fontSize: 20, color: 'white'}}>Logout</Text>
              </TouchableOpacity>
          </Col>
        </Grid>
      </View>
      <CardStack
        loop
        style={styles.content}
        ref={swiper}
        renderNoMoreCards={() => <Text style={{ fontWeight: '700', fontSize: 18, color: 'gray' }}>No more cards :(</Text>}
        onSwipedRight={(idx) => onSwiped(idx, true)}
        onSwipedLeft={(idx) => onSwiped(idx, false)}
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
  headerName: {
    fontSize: 18,
    color: '#222'
  },
  headerBudget: {
    fontSize: 16,
    color: '#222'
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
  },
  logout:{
    width:150,
    height:50,
    backgroundColor:'#fd267d',
    borderRadius:75,
    borderWidth:6,
    borderColor:'#fd267d',
  }
});

export default App;
