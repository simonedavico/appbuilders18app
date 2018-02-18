import React from 'react';
import { StyleSheet, Text, View, SectionList, Button, Image, ActivityIndicator, TouchableOpacity, TouchableHighlight } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { StackNavigator } from 'react-navigation';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import moment from 'moment';
const ApiClient = require('../api/ApiClient');
const client = new ApiClient();

export default class ScheduleScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      title: 'Schedule',
      tabBarLabel: 'Schedule',
      showIcon: true,
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../images/schedule.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),
      headerRight: (
        params.button
        
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sections: null,
      selectedIndex: 0
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({ scrollToNow: this._scrollToNow, button: (<Button title="Now" color="#e91e63" onPress={() => this.scrollToNow()}></Button>) });
    client.getTalks('day').then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  reloadDataSource = () => {
    // Reload datasource.
    const index = this.state.selectedIndex;
    let groupedBy;
    if (index == 0) {
      groupedBy = 'day';
      this.props.navigation.setParams({ button: (<Button title="Now" color="#e91e63" onPress={() => this.scrollToNow()}></Button>) });
    } else if (index == 1) {
      groupedBy = 'room';
      this.props.navigation.setParams({ button: null});
    } else if (index == 2) {
      groupedBy = 'custom';
      this.props.navigation.setParams({ button: (<Button title="Now" color="#e91e63" onPress={() => this.scrollToNow()}></Button>) });
    }
    client.getTalks(groupedBy).then(talks => {
      this.setState({
        isLoading: false,
        sections: talks
      });
    });
  }

  scrollToNow = () => {
    moment.locale('en');
    const today = moment();
    const time = today.format("HH:mm");
    const day = today.format('D') // 16th 
    const month = today.format('M') // 4 == April
    const year = today.format('YYYY') // 2018
    
    let index;
    // It's Monday 16th April.
    if (day == 16 && month == 4 && year == 2018) {
      index = 0;
    } else if (day == 17 && month == 4 && year == 2018) {
      // It's Tuesday 17th April.
      index = 1;
    } else {
      // Not App Builders today, just return.
      return;
    }
    // Find closest talk to current time.
    let row = 0;
    for (talk of this.state.sections[index].data) {
      if (time.localeCompare(talk.time) == 1) {
        row++;
      }
    }
    this.talksSectionListRef.scrollToLocation({
      animated: true,
      sectionIndex: index,
      itemIndex: row,
      viewOffset: 20
    });
  }

  handleIndexChange(index) {
    this.setState({
      selectedIndex: index,
      isLoading: true
    }, () => this.reloadDataSource());
  }

  formatDate(string) {
    return moment(string).format('h:mm A');
  }

  renderTalk(talk) {
    const { navigate } = this.props.navigation;
    if (talk.speaker) {
      return (
        <TouchableOpacity onPress={() => navigate('Talk', {talk: talk, client: client, reloadDataSource: this.reloadDataSource})}>
          <View style={styles.talkMainContainer}>
            <View style={styles.talkContainer}>
              <View style={styles.speakerContainer}>
                <Image style={styles.speakerImage} source={{uri: talk.speaker.picture}} />
                <View style={styles.talkTextContainer}>
                  <Text style={styles.talkTitle}>{talk.title}</Text>
                  <Text style={styles.talkSpeaker}>{talk.speaker.firstName} {talk.speaker.lastName}</Text>
                </View>
              </View>
              <Text style={styles.talkInformation}>{talk.time} | {talk.room}</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Image style={styles.arrow} source={require('../images/arrow.png')} />
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.talkMainContainer}>
          <View style={styles.talkContainer}>
            <View style={styles.speakerContainer}>
              <View style={styles.talkTextContainer}>
                <Text style={styles.talkTitle}>{talk.title}</Text>
              </View>
            </View>
            <Text style={styles.talkInformation}>{talk.time} | {talk.room}</Text>
          </View>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.segmentedControlContainer}>
          <SegmentedControlTab
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            values={['By Day', 'By Room', 'My Conference']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange.bind(this)}
          />
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator />
        ) : (
          <SectionList
            ref={ref => { this.talksSectionListRef = ref; }}
            sections={this.state.sections}
            renderItem={({item}) => this.renderTalk(item)}
            renderSectionHeader={({section}) => (
              [section.data.length > 0 ? (
                <Text key="1" style={styles.sectionHeader}>{section.title}</Text>
              ) : (
                <Text key="2" style={styles.emptyHeaderText}>Plan your conference by ❤️ the talks you wish to attend.</Text>
            )])}
            keyExtractor={(item, index) => index}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 0,
   backgroundColor: 'transparent'
  },
  talkMainContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  },
  sectionHeader: {
    marginTop: 0,
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    backgroundColor: 'rgba(247,247,247,1.0)',
    height: 20,
    fontSize: 14,
    fontWeight: 'bold',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
  },
  emptyHeaderText: {
    margin: 20,
    marginTop: 100,
    fontSize: 20,
    lineHeight: 30,
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
  talkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    borderRadius: 10,
    fontSize: 18
  },
  talkSpeaker: {
    paddingTop: 5,
    fontSize: 16,
  },
  talkInformation: {
    margin: 10,
    marginTop: 0,
  },
  talkContainer: {
    flex: 1,
    flexDirection: 'column',
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
  },
  tabsContainerStyle: {
    margin: 10,
    width: 325
  },
  tabStyle: {
    backgroundColor: 'transparent',
    borderColor: '#e91e63'
  },
  tabTextStyle: {
    color: '#e91e63'
  },
  activeTabStyle: {
    backgroundColor: '#e91e63'
  },
  segmentedControlContainer: {
    alignItems: 'center'
  },
})
