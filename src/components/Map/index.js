import React, { Component } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as ModalActions } from '../../store/ducks/modal';
import "mapbox-gl/dist/mapbox-gl.css";
import './styles.css';

class Map extends Component {
    state = {
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            latitude: -21.1762019,
            longitude: -47.8260036,
            zoom: 12,
        },
    };

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = () => {
        const { viewport } = this.state;
        this.setState({
            viewport: {
                ...viewport,
                width: window.innerWidth,
                height: window.innerHeight,
            },
        });
    };

    handleMapClick = async (e) => {
        const [longitude, latitude] = e.lngLat;
        const { showModal } = this.props;

        // console.log(e.lngLat);

        await showModal({ latitude, longitude });
    };

    render() {
        const { viewport: viewportState } = this.state;
        const { users } = this.props;
        return (
            <MapGL
                {...viewportState}
                onClick={this.handleMapClick}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                mapboxApiAccessToken="pk.eyJ1IjoicGNuYWhpbWUiLCJhIjoiY2p6NjZ5YTM1MGFzOTNibDhoZDhiMDVxeiJ9.JivURlILhlKgeg0jmzo0ow"
                onViewportChange={viewport => this.setState({ viewport })}
            >
                {users.data.map(user => (
                    <Marker
                        latitude={user.cordinates.latitude}
                        longitude={user.cordinates.longitude}
                        key={user.id}
                    >
                        <img className="avatar" alt={`${user.name} Avatar`} src={user.avatar} />
                    </Marker>
                ))}
            </MapGL>
        );
    }
}

const mapStateToProps = state => ({
    users: state.users,
});

const mapDispatchToProps = dispatch => bindActionCreators(ModalActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Map);