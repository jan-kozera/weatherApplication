import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { API_KEY } from './API';
import {Picker} from '@react-native-picker/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

let customFonts = {
  'Overpass-regular': require('./assets/Overpass-Regular.ttf'),
  'Overpass-bold': require('./assets/Overpass-Bold.ttf')
};

export default class MainScreen extends Component {

  state = {
    fontsLoaded: false,
    city: "Stockholm",
    lon: "",
    lat: "",
    temp: "",
    icon: "",
    desc: "",
    humidity:"",
    wind:"",
    dateTxt :"",
    timezone: "",
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetch_weather();
  }

  fetch_weather = () => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=${API_KEY}`)
      .then(res=> res.json())
      .then(json => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        let myDate = new Date(json.dt*1000 + json.timezone*1000);
        
        this.setState({
          temp: (json.main.temp - 273.15).toFixed(0) + "°",
          icon: json.weather[0].icon,
          desc: json.weather[0].main,
          humidity: json.main.humidity + " %",
          wind: json.wind.speed + " km/h",
          lon: json.coord.lon,
          lat: json.coord.lat,
          dateTxt: myDate.getDate()+" "+monthNames[myDate.getMonth()],
          timezone: json.timezone,
        });
      });
       
  }

  render() {
    if(this.state.fontsLoaded){
      return (
        <View style={styles.container}>
          <View style={styles.pickerContainer}>
            <Image source={require('./assets/marker.png')} style={{width: 24, height: 24, marginTop: 12 }}/>
            <Picker
                  selectedValue={this.state.city}
                  onValueChange={(itemValue) => this.setState({city: itemValue}, () => {this.fetch_weather()})}
                  style={{height: 50, width: 150,color: '#ffffff', fontFamily: 'Overpass-bold',marginLeft: 80, transform: [{ scaleX: 2 }, { scaleY: 2 }]}}
              >
                  <Picker.Item label="Stockholm" value="Stockholm"/>
                  <Picker.Item label="London" value="London"/>
                  <Picker.Item label="Warsaw" value="Warsaw"/>
                  <Picker.Item label="Moscow" value="Moscow"/>
                  <Picker.Item  label="Berlin" value="Berlin"/>
              </Picker>
            </View>
            <View style={styles.iconContainer}>
              <Image tintColor='#FFF' source={{uri:"http://openweathermap.org/img/wn/"+this.state.icon+"@2x.png"}} style={{width: 150, height: 150}}/>
            </View>
            <View style={styles.dataBox}>
              <Text style={styles.dateText}>Today, {this.state.dateTxt}</Text>
              <Text style={styles.tempText}>{this.state.temp}</Text>
              <Text style={styles.descText}>{this.state.desc}</Text>
              <View style={styles.detailBox}>
                <Image source={require('./assets/wind.png')} style={{width: 20, height: 20}}/>
                <Text style={styles.detailHeader}>Wind</Text>
                <Text style={styles.detailBorder}>|</Text>
                <Text style={styles.detailContent}>{this.state.wind}</Text>
              </View>
              <View style={styles.detailBox}>
                <Image source={require('./assets/hum.png')} style={{width: 18, height: 22}}/>
                <Text style={styles.detailHeader}>Hum</Text>
                <Text style={styles.detailBorder}>|</Text>
                <Text style={styles.detailContent}>{this.state.humidity}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ReportScreen',{lat: this.state.lat, lon:this.state.lon, timezone: this.state.timezone})} style={styles.pageButton}>
                <Text style={styles.buttonText}>Forecast report</Text>
                <Image source={require('./assets/arrow-up.png')} style={{width: 20, height: 8, marginRight: 15}} resizeMode='contain'/>
              </TouchableOpacity>
            </View>
        </View>
      )
    }else {
      return <AppLoading />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
  },
  pickerContainer: {
    flexDirection: 'row',
    marginTop: '13%',
    textAlign: 'left',
    width: '85%',
  },
  pickerStyles: {
    height: '37',
    width: '150',
    color: '#fff',
    fontSize: 24,
    lineHeight: 37,
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontFamily: 'Overpass-bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '25%',
  },
  dataBox: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    width: '85%',
    height: '45%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Overpass-regular',
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  buttonStyles: {
    fontFamily: 'Overpass-regular'
  },
  tempText: {
    fontFamily: 'Overpass-regular',
    fontSize: 100,
    lineHeight: 150,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: -4, height: 8},
    textShadowRadius: 50,
  },
  descText: {
    fontFamily: 'Overpass-bold',
    fontSize: 24,
    lineHeight: 36,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    margin: 8,
  },
  detailHeader: {
    width: '30%',
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  detailBorder: {
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
  },
  detailContent: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: -2, height: 3},
    textShadowRadius: 1,
    textAlign: 'center',
    width: '40%',
  },
  buttonContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 35,
  },
  pageButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: -4,
      height: 8,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    paddingHorizontal: 20,
    margin: 10,
    fontFamily: 'Overpass-regular',
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 36,
    color: '#444E72',
  }
});