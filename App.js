import React from 'react';
import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      raceData: [],
      sortedRaces: [],
      unsortedRaces: [],
      selectedCategory: null,
      time: Date.now(),
      rowsToFetch: 5,
    };

    document.title = 'Entain Coding Test';
  }

  // Use fetch API to gather the 10 next races to jump and add it to app state
  // then set interval to update time in app state
  componentDidMount() {
    this.getRacingData();

    this.interval = setInterval(() => {
      this.setState({ time: Date.now() });
      this.getRacingData();
    }, 1000);
  }

  // Clear the interval once app is closed/unmounted
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Fetch a specified number of next races to jump, sort by time ascending
  // race categories and races >=60 seconds over start time
  getRacingData = () => {
    fetch(`https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=${this.state.rowsToFetch}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(res => res.json()).then(json => {
      const { data } = json;

      this.setState({
        sortedRaces: [],
      })

      let newRaces = [];

      const races = data.race_summaries;

      for (const [key] of Object.entries(races)) {
        const race = races[key];
        newRaces = newRaces.concat({
          advertisedStart: race.advertised_start.seconds,
          race_number: race.race_number,
          meeting_name: race.meeting_name,
          category_id: race.category_id,            
        });
        if(this.state.selectedCategory === null){
          
        }else{
          newRaces = newRaces.filter(id => id.category_id === this.state.selectedCategory);
        }
      }


      // Sort races by time to jump and add them to race list
      newRaces.sort((item1, item2) => {
        return item1.advertisedStart - item2.advertisedStart;
      });

      // Filter races for only those which are <60 seconds over start time
      let sortedRaceCount = 0;

      this.setState({
        unsortedRaces: newRaces,
        sortedRaces: newRaces.filter((value) => {
          if (sortedRaceCount < 5 && (value.advertisedStart - (this.state.time / 1000)) > -60000) {
            sortedRaceCount++;
            return true;
          }
          return false;
        })
      });


      if (sortedRaceCount < 5) {
        this.setState({ rowsToFetch: this.state.rowsToFetch + 1 });
        this.getRacingData();
      }
    });
  }

  // Format time in XXmin XXs
  getFormattedTime = (rawTime) => {
    const timeMs = Math.round(rawTime - (this.state.time / 1000));
    const timeMins = Math.floor(Math.abs(timeMs) / 60);
    const timeSecs = timeMs % 60;

    return timeMins + "min " + timeSecs + "s";
    // TODO: Implement your logic to format the display of the race jump time
  }

  // Render components
  render() {
    return (
      <div className="container">
        <div className="buttonContainer">
          <button className="buttonToggle" onClick={() => {
            // TODO: Populate the state sets with appropriate actions to give each button functionality
            this.setState({selectedCategory: null});
            this.getRacingData();
          }}>All Races</button>
        </div>
        <div className="categories">
          <div className="buttonContainer">
            <button className="buttonToggle" onClick={() => {
              // TODO: Populate the state sets with appropriate actions to give each button functionality
              this.setState({selectedCategory: "9daef0d7-bf3c-4f50-921d-8e818c60fe61"});
              this.getRacingData();
            }}>Greyhounds</button>
          </div>
          <div className="buttonContainer">
            <button className="buttonToggle" onClick={() => {
              // TODO: Populate the state sets with appropriate actions to give each button functionality
              this.setState({selectedCategory: "161d9be2-e909-4326-8c2c-35ed71fb460b"});
              this.getRacingData();
            }}>Harness</button>
          </div>
          <div className="buttonContainer">
            <button className="buttonToggle" onClick={() => {
              // TODO: Populate the state sets with appropriate actions to give each button functionality
              this.setState({selectedCategory: "4a2788f8-e825-4d36-9894-efd4baf1cfae"});
              this.getRacingData();
            }}>Thoroughbreds</button>
          </div>
        </div>
        <div className="list">
          {this.state.sortedRaces.map(item => (
            <ul>
              {/* TODO: Edit the string below to display the Race number, Meeting name and time to jump */}
              <span className="item">Race {item.race_number} - Meeting {item.meeting_name} - Jumps in {this.getFormattedTime(item.advertisedStart)}</span>
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
