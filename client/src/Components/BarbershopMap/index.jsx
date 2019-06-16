import React, { Component } from 'react';
import './BarbershopMap.css';
import GoogleMapReact from 'google-map-react';
import { GOOGLE_MAPS_API_KEY } from '../../lib/Constants';

const MapPin = props => {
  return (
    <img
      className='barbershop-map__map-pin-image'
      alt='barbershop pin'
      src='/assets/barbershop-pin.png' 
    />
  )
}

export default class BarbershopMap extends Component {
  static defaultProps = {
    center: {
      lat: 100,
      lng: 100
    },
    zoom: 15
  };

  render() {
    const center = {
      lat: parseFloat(this.props.latitude),
      lng: parseFloat(this.props.longitude)
    }
    return (
      // Important! Always set the container height explicitly
      <div className='barbershop-map__wrapper'>
        <GoogleMapReact
          bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
          defaultCenter={center}
          defaultZoom={this.props.zoom}
          draggable={false}
          options={{
            disableDefaultUI: true
          }}
        >
          <MapPin
            lat={this.props.latitude}
            lng={this.props.longitude}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}



