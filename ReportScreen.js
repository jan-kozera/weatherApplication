import React, { Component } from 'react';
import { Button, View, Text, Image, StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { API_KEY } from './API';
import { FlatList } from 'react-native-gesture-handler';

let customFonts = {
  'Overpass-regular': require('./assets/Overpass-Regular.ttf'),
  'Overpass-bold': require('./assets/Overpass-Bold.ttf')
};

export default class ReportScreen extends Component {
constructor(props){
  super(props);
  this.state = {
    fontsLoaded: false,
    city: 'Stockholm',
    lon: "",
    lat: "",
    timezone: "",
    hourly: [],
    daily: [],
  }
}
  

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.setState({lon:this.props.route.params.lon, lat:this.props.route.params.lat, timezone: this.props.route.params.timezone}, ()=>this.fetch_weather())
  }

  fetch_weather = () => {
    fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.lon}&exclude=minutely&appid=${API_KEY}`)
      .then(res=> res.json())
      .then(json => {
        this.setState({
          hourly: json.hourly,
          daily: json.daily,
        });
      });
       
  }

  render() {
    if(this.state.fontsLoaded){
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.dayContainer}>
            <Text style={styles.dayToday}>Today</Text>
            <Text style={styles.dayDate}>Sep, 12</Text>
          </View>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={this.state.hourly}
            renderItem={({ item }) => {
              let myDate = new Date(item.dt*1000 + this.state.timezone*1000);
              return (
                  <View style={{width: 80, height: 180}}>
                    <Text style={styles.hourlyTemp}>{(item.temp - 273.15).toFixed(0) + " °C"}</Text>
                    <Image source={{uri:"http://openweathermap.org/img/wn/"+item.weather[0].icon+"@2x.png"}} style={{width: 40, height: 40, marginLeft: 'auto', marginRight: 'auto', marginTop: '10%',marginBottom: '10%'}}/>
                    <Text style={styles.hourlyHour}>{myDate.getHours()}:00</Text>
                  </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
          <View style={styles.nextContainer}>
            <Text style={styles.dayToday}>Next forecast</Text>
            <Image source={require('./assets/calendar.png')} style={{width: 20, height: 20, marginLeft: 'auto', marginTop: 7}}/>  
            
          </View>
          <FlatList
            data={this.state.daily}
            style={styles.dayList}
            renderItem={({ item }) => {
              let myDate = new Date(item.dt*1000 + this.props.route.params.timezone*1000);
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return (
                  <View style={styles.nextDayContainer}>
                    <Text style={styles.nextDayDay}>{monthNames[myDate.getMonth()]}, {myDate.getDate()}</Text>
                    <View style={styles.nextDayImage}>
                      <Image source={{uri:"http://openweathermap.org/img/wn/"+item.weather[0].icon+"@2x.png"}} style={{width: 50, height: 50}}/>
                    </View>
                    <Text style={styles.nextDayTemp}>{(item.temp.day - 273.15).toFixed(0) + " °C"}</Text>
                  </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          ></FlatList>
          <View style={styles.copyrightContainer}>
            <Image source={require('./assets/sun.png')} style={{width: 22, height: 22}}/>
            <Text style={styles.copyrightText}>AccuWeather</Text>
          </View>
        </View>
      )
    }else {
      return <AppLoading/>
    }
  }
}

const styles = StyleSheet.create({
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '85%',
    marginTop: '2%',
    marginBottom: '5%',
  },
  dayToday: {
    width: '50%',
    fontFamily: 'Overpass-bold',
    fontSize: 24,
    lineHeight: 36,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  dayDate: {
    width: '50%',
    fontSize: 18,
    lineHeight: 36,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
    textAlign: 'right',
  },
  alignRight: {
    textAlign: 'right',
  },
  nextContainer: {
    flexDirection: 'row',
    width: '85%',
    marginTop: '6%',
    marginBottom: '4%',
  },
  hourlyTemp: {
    textAlign: 'center',
    fontFamily: 'Overpass-regular',
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  hourlyHour: {
    textAlign: 'center',
    fontFamily: 'Overpass-regular',
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  dayList: {
    width: '90%',
  },
  nextDayContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '2%',
  },
  nextDayDay: {
    width: '40%',
    fontFamily: 'Overpass-bold',
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
    paddingLeft: 10,
  },
  nextDayImage: {
    width: '20%',
    alignItems: 'center'
  },
  nextDayTemp: {
    width: '40%',
    textAlign: 'right',
    fontFamily: 'Overpass-regular',
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
    paddingRight: 20,
  },
  copyrightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
    marginTop: '8%',
  },
  copyrightText: {
    fontFamily: 'Overpass-regular',
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
    marginLeft: 15
  }
});