import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, SectionList, TouchableOpacity, Linking } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import Mailer from 'react-native-mail';
import DeviceInfo from 'react-native-device-info';

export default class InformationScreen extends React.Component {
  static navigationOptions = {
    title: 'Information',
    tabBarLabel: 'Information',
    showIcon: true,
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../images/info.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  componentWillMount() {
    this.setState({
      sections: [
        {
          title: "",
          data: [
            {
              title: "Venue Location",
              action: this.showVenueLocation
            },
            {
              title: "Organizers",
              action: this.showOrganizers
            },
            {
              title: "Code of Conduct",
              action: this.showCodeOfConduct
            },
            {
              title: "Contact via Email",
              action: this.showSupportEmail
            },
            {
              title: "Contact via Twitter",
              action: this.showTwitterSupport
            },
            {
              title: "Contribute on GitHub",
              action: this.showContributeGitHub
            },
            {
              title: "Libraries Included",
              action: this.showAcknowledgements
            }
          ]
        }
      ]
    });
  }

  showVenueLocation = () => {
    const { navigate } = this.props.navigation;
    navigate('VenueLocation');
  }

  showOrganizers = () =>  {
    const { navigate } = this.props.navigation;
    navigate('Organizers');
  }

  showCodeOfConduct() {
    // TODO: 
  }

  showSupportEmail() {
    // TODO: Test on Android
    Mailer.mail({
      subject: 'App Builders 2018',
      recipients: ['info@swissmobidevs.org'],
      ccRecipients: [],
      bccRecipients: [],
      body: '',
      isHTML: true,
    }, (error, event) => {
    });
  }

  showTwitterSupport() {
    const url = 'https://twitter.com/appbuilders_ch';
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log(`Can't handle url: ${url}`);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  showContributeGitHub() {
    const url = 'https://github.com/BalestraPatrick/appbuilders18app';
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log(`Can't handle url: ${url}`);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  showAcknowledgements() {
    // TODO:
  }

  renderRow(item) {
    return (
      <TouchableOpacity onPress={() => item.action()}>
        <View style={styles.infoMainContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>{item.title}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Image style={styles.arrow} source={require('../images/arrow.png')} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SectionList
        sections={this.state.sections}
        renderItem={({item}) => this.renderRow(item)}
        renderSectionHeader={({section}) => <View style={styles.sectionHeader}></View>}
        renderSectionFooter={({section}) => <Text style={styles.sectionFooter}>Version {DeviceInfo.getVersion()}</Text>}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 0,
   backgroundColor: 'transparent'
  },
  infoMainContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  },
  sectionHeader: {
    marginTop: 10,
    backgroundColor: 'transparent',
    height: 20,
  },
  sectionFooter: {
    textAlign: 'center'
  },
  talkTextContainer: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 10
  },
  speakerImage: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 10
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    borderRadius: 10,
    fontSize: 18,
    marginLeft: 10
  },
  talkSpeaker: {
    paddingTop: 5,
    fontSize: 16,
  },
  talkInformation: {
    margin: 10,
    marginTop: 0,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  speakerContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 5
  },
  arrow: {
    height: 25,
    paddingRight: 15,
  }
})
