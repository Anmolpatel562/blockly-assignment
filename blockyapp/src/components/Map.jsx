import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import car from "../assets/pngegg.png";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYW5tb2xwYXRlbDU2MiIsImEiOiJjbHp0dmhkY3IxeXhuMmlzM3Nxa2xkZXl5In0.gzMz6e7phFHtB-OVbxD-zQ";

const vehicleIcon = new L.Icon({
  iconUrl: "https://static.vecteezy.com/system/resources/previews/009/760/728/original/map-pointer-with-car-icon-illustration-vector.jpg",
  iconSize: [60, 45],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];
        setCurrentPosition(newPosition);
      },
      (error) => {
        console.error("Error getting current position", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleDestinationSubmit = async (e) => {
    e.preventDefault();

    if (!destination || !currentPosition) return;

    try {
      // Geocode the destination address to get the coordinates
      const geocodeResponse = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          destination
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const destinationCoordinates =
        geocodeResponse.data.features[0].center.reverse();

      const routeResponse = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${currentPosition[1]},${currentPosition[0]};${destinationCoordinates[1]},${destinationCoordinates[0]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`
      );

      const coordinates = routeResponse.data.routes[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]]
      );

      setRouteCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching the route", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleDestinationSubmit}
        style={{
          position: "absolute",
          zIndex: 1000,
          padding: "10px",
          background: "white",
          left: "50px",
          top: "10px",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
          style={{ width: "200px", padding: "10px" }}
          list="places"
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Go
        </button>
        <datalist>
          {/* <!-- Andhra Pradesh --> */}
          <option>Adoni</option>
          <option>Amaravati</option>
          <option>Anantapur</option>
          <option>Chandragiri</option>
          <option>Chittoor</option>
          <option>Dowlaiswaram</option>
          <option>Eluru</option>
          <option>Guntur</option>
          <option>Kadapa</option>
          <option>Kakinada</option>
          <option>Kurnool</option>
          <option>Machilipatnam</option>
          <option>Nagarjunakoṇḍa</option>
          <option>Rajahmundry</option>
          <option>Srikakulam</option>
          <option>Tirupati</option>
          <option>Vijayawada</option>
          <option>Visakhapatnam</option>
          <option>Vizianagaram</option>
          <option>Yemmiganur</option>

          {/* <!-- Arunachal Pradesh --> */}
          <option>Itanagar, Arunachal Pradesh</option>
          <option>Tawang, Arunachal Pradesh</option>
          <option>Pasighat, Arunachal Pradesh</option>

          {/* <!-- Assam --> */}
          <option>Dhuburi</option>
          <option>Dibrugarh</option>
          <option>Dispur</option>
          <option>Guwahati</option>
          <option>Jorhat</option>
          <option>Nagaon</option>
          <option>Sivasagar</option>
          <option>Silchar</option>
          <option>Tezpur</option>
          <option>Tinsukia</option>

          {/* <!-- Bihar --> */}
          <option>Ara</option>
          <option>Barauni</option>
          <option>Begusarai</option>
          <option>Bettiah</option>
          <option>Bhagalpur</option>
          <option>Bihar Sharif</option>
          <option>Bodh Gaya</option>
          <option>Buxar</option>
          <option>Chapra</option>
          <option>Darbhanga</option>
          <option>Dehri</option>
          <option>Dinapur Nizamat</option>
          <option>Gaya</option>
          <option>Hajipur</option>
          <option>Jamalpur</option>
          <option>Katihar</option>
          <option>Madhubani</option>
          <option>Motihari</option>
          <option>Munger</option>
          <option>Muzaffarpur</option>
          <option>Patna</option>
          <option>Purnia</option>
          <option>Pusa</option>
          <option>Saharsa</option>
          <option>Samastipur</option>
          <option>Sasaram</option>
          <option>Sitamarhi</option>
          <option>Siwan</option>

          {/* <!-- Chhattisgarh --> */}
          <option>Ambikapur</option>
          <option>Bhilai</option>
          <option>Bilaspur</option>
          <option>Dhamtari</option>
          <option>Durg</option>
          <option>Jagdalpur</option>
          <option>Raipur</option>
          <option>Rajnandgaon</option>

          {/* <!-- Goa --> */}
          <option>Panaji, Goa</option>
          <option>Margao, Goa</option>
          <option>Vasco da Gama, Goa</option>

          {/* <!-- Gujarat --> */}
          <option>Ahmadabad</option>
          <option>Amreli</option>
          <option>Bharuch</option>
          <option>Bhavnagar</option>
          <option>Bhuj</option>
          <option>Dwarka</option>
          <option>Gandhinagar</option>
          <option>Godhra</option>
          <option>Jamnagar</option>
          <option>Junagadh</option>
          <option>Kandla</option>
          <option>Khambhat</option>
          <option>Kheda</option>
          <option>Mahesana</option>
          <option>Morbi</option>
          <option>Nadiad</option>
          <option>Navsari</option>
          <option>Okha</option>
          <option>Palanpur</option>
          <option>Patan</option>
          <option>Porbandar</option>
          <option>Rajkot</option>
          <option>Surat</option>
          <option>Surendranagar</option>
          <option>Valsad</option>
          <option>Veraval</option>

          {/* <!-- Haryana --> */}
          <option>Ambala</option>
          <option>Bhiwani</option>
          <option>Chandigarh</option>
          <option>Faridabad</option>
          <option>Firozpur Jhirka</option>
          <option>Gurugram</option>
          <option>Hansi</option>
          <option>Hisar</option>
          <option>Jind</option>
          <option>Kaithal</option>
          <option>Karnal</option>
          <option>Kurukshetra</option>
          <option>Panipat</option>
          <option>Pehowa</option>
          <option>Rewari</option>
          <option>Rohtak</option>
          <option>Sirsa</option>
          <option>Sonipat</option>

          {/* <!-- Himachal Pradesh --> */}
          <option>Bilaspur</option>
          <option>Chamba</option>
          <option>Dalhousie</option>
          <option>Dharmshala</option>
          <option>Hamirpur</option>
          <option>Kangra</option>
          <option>Kullu</option>
          <option>Mandi</option>
          <option>Nahan</option>
          <option>Shimla</option>
          <option>Una</option>

          <option>Anantnag</option>
          <option>Baramula</option>
          <option>Doda</option>
          <option>Gulmarg</option>
          <option>Jammu</option>
          <option>Kathua</option>
          <option>Punch</option>
          <option>Rajouri</option>
          <option>Srinagar</option>
          <option>Udhampur</option>

          {/* <!-- Jharkhand --> */}
          <option>Bokaro</option>
          <option>Chaibasa</option>
          <option>Deoghar</option>
          <option>Dhanbad</option>
          <option>Dumka</option>
          <option>Giridih</option>
          <option>Hazaribag</option>
          <option>Jamshedpur</option>
          <option>Jharia</option>
          <option>Rajmahal</option>
          <option>Ranchi</option>
          <option>Saraikela</option>

          {/* <!-- Karnataka --> */}
          <option>Badami</option>
          <option>Ballari</option>
          <option>Bengaluru</option>
          <option>Belagavi</option>
          <option>Bhadravati</option>
          <option>Bidar</option>
          <option>Chikkamagaluru</option>
          <option>Chitradurga</option>
          <option>Davangere</option>
          <option>Halebid</option>
          <option>Hassan</option>
          <option>Hubballi-Dharwad</option>
          <option>Kalaburagi</option>
          <option>Kolar</option>
          <option>Madikeri</option>
          <option>Mandya</option>
          <option>Mangaluru</option>
          <option>Mysuru</option>
          <option>Raichur</option>
          <option>Shivamogga</option>
          <option>Shravanabelagola</option>
          <option>Shrirangapattana</option>
          <option>Tumakuru</option>
          <option>Vijayapura</option>

          {/* <!-- Kerala --> */}
          <option>Alappuzha</option>
          <option>Vatakara</option>
          <option>Idukki</option>
          <option>Kannur</option>
          <option>Kochi</option>
          <option>Kollam</option>
          <option>Kottayam</option>
          <option>Kozhikode</option>
          <option>Mattancheri</option>
          <option>Palakkad</option>
          <option>Thalassery</option>
          <option>Thiruvananthapuram</option>
          <option>Thrissur</option>

          {/* <!-- Madhya Pradesh --> */}
          <option>Balaghat</option>
          <option>Barwani</option>
          <option>Betul</option>
          <option>Bharhut</option>
          <option>Bhind</option>
          <option>Bhojpur</option>
          <option>Bhopal</option>
          <option>Burhanpur</option>
          <option>Chhatarpur</option>
          <option>Chhindwara</option>
          <option>Damoh</option>
          <option>Datia</option>
          <option>Dewas</option>
          <option>Dhar</option>
          <option>Dr. Ambedkar Nagar (Mhow)</option>
          <option>Guna</option>
          <option>Gwalior</option>
          <option>Hoshangabad</option>
          <option>Indore</option>
          <option>Itarsi</option>
          <option>Jabalpur</option>
          <option>Jhabua</option>
          <option>Khajuraho</option>
          <option>Khandwa</option>
          <option>Khargone</option>
          <option>Maheshwar</option>
          <option>Mandla</option>
          <option>Mandsaur</option>
          <option>Morena</option>
          <option>Murwara</option>
          <option>Narsimhapur</option>
          <option>Narsinghgarh</option>
          <option>Narwar</option>
          <option>Neemuch</option>
          <option>Nowgong</option>
          <option>Orchha</option>
          <option>Panna</option>
          <option>Raisen</option>
          <option>Rajgarh</option>
          <option>Ratlam</option>
          <option>Rewa</option>
          <option>Sagar</option>
          <option>Sarangpur</option>
          <option>Satna</option>
          <option>Sehore</option>
          <option>Seoni</option>
          <option>Shahdol</option>
          <option>Shajapur</option>
          <option>Sheopur</option>
          <option>Shivpuri</option>
          <option>Ujjain</option>
          <option>Vidisha</option>

          {/* <!-- Maharashtra --> */}
          <option>Ahmadnagar</option>
          <option>Akola</option>
          <option>Amravati</option>
          <option>Aurangabad</option>
          <option>Bhandara</option>
          <option>Bhusawal</option>
          <option>Bid</option>
          <option>Buldhana</option>
          <option>Chandrapur</option>
          <option>Daulatabad</option>
          <option>Dhule</option>
          <option>Jalgaon</option>
          <option>Kalyan</option>
          <option>Karli</option>
          <option>Kolhapur</option>
          <option>Mahabaleshwar</option>
          <option>Malegaon</option>
          <option>Matheran</option>
          <option>Mumbai</option>
          <option>Nagpur</option>
          <option>Nanded</option>
          <option>Nashik</option>
          <option>Osmanabad</option>
          <option>Pandharpur</option>
          <option>Parbhani</option>
          <option>Pune</option>
          <option>Ratnagiri</option>
          <option>Sangli</option>
          <option>Satara</option>
          <option>Sevagram</option>
          <option>Solapur</option>
          <option>Thane</option>
          <option>Ulhasnagar</option>
          <option>Vasai-Virar</option>
          <option>Wardha</option>
          <option>Yavatmal</option>

          {/* <!-- Manipur --> */}
          <option>Imphal, Manipur</option>
          <option>Bishnupur, Manipur</option>
          <option>Churachandpur, Manipur</option>

          {/* <!-- Meghalaya --> */}
          <option>Shillong, Meghalaya</option>
          <option>Tura, Meghalaya</option>
          <option>Nongpoh, Meghalaya</option>

          {/* <!-- Mizoram --> */}
          <option>Aizawl, Mizoram</option>
          <option>Lunglei, Mizoram</option>
          <option>Champhai, Mizoram</option>

          {/* <!-- Nagaland --> */}
          <option>Kohima, Nagaland</option>
          <option>Dimapur, Nagaland</option>
          <option>Mokokchung, Nagaland</option>

          {/* <!-- Odisha --> */}
          <option>Balangir</option>
          <option>Baleshwar</option>
          <option>Baripada</option>
          <option>Bhubaneshwar</option>
          <option>Brahmapur</option>
          <option>Cuttack</option>
          <option>Dhenkanal</option>
          <option>Kendujhar</option>
          <option>Konark</option>
          <option>Koraput</option>
          <option>Paradip</option>
          <option>Phulabani</option>
          <option>Puri</option>
          <option>Sambalpur</option>
          <option>Udayagiri</option>

          {/* <!-- Punjab --> */}
          <option>Amritsar</option>
          <option>Batala</option>
          <option>Chandigarh</option>
          <option>Faridkot</option>
          <option>Firozpur</option>
          <option>Gurdaspur</option>
          <option>Hoshiarpur</option>
          <option>Jalandhar</option>
          <option>Kapurthala</option>
          <option>Ludhiana</option>
          <option>Nabha</option>
          <option>Patiala</option>
          <option>Rupnagar</option>
          <option>Sangrur</option>

          {/* <!-- Rajasthan --> */}
          <option>Abu</option>
          <option>Ajmer</option>
          <option>Alwar</option>
          <option>Amer</option>
          <option>Barmer</option>
          <option>Beawar</option>
          <option>Bharatpur</option>
          <option>Bhilwara</option>
          <option>Bikaner</option>
          <option>Bundi</option>
          <option>Chittaurgarh</option>
          <option>Churu</option>
          <option>Dhaulpur</option>
          <option>Dungarpur</option>
          <option>Ganganagar</option>
          <option>Hanumangarh</option>
          <option>Jaipur</option>
          <option>Jaisalmer</option>
          <option>Jalor</option>
          <option>Jhalawar</option>
          <option>Jhunjhunu</option>
          <option>Jodhpur</option>
          <option>Kishangarh</option>
          <option>Kota</option>
          <option>Merta</option>
          <option>Nagaur</option>
          <option>Nathdwara</option>
          <option>Pali</option>
          <option>Phalodi</option>
          <option>Pushkar</option>
          <option>Sawai Madhopur</option>
          <option>Shahpura</option>
          <option>Sikar</option>
          <option>Sirohi</option>
          <option>Tonk</option>
          <option>Udaipur</option>

          {/* <!-- Sikkim --> */}
          <option>Gangtok, Sikkim</option>
          <option>Namchi, Sikkim</option>
          <option>Gyalshing, Sikkim</option>

          {/* <!-- Tamil Nadu --> */}
          <option>Arcot</option>
          <option>Chengalpattu</option>
          <option>Chennai</option>
          <option>Chidambaram</option>
          <option>Coimbatore</option>
          <option>Cuddalore</option>
          <option>Dharmapuri</option>
          <option>Dindigul</option>
          <option>Erode</option>
          <option>Kanchipuram</option>
          <option>Kanniyakumari</option>
          <option>Kodaikanal</option>
          <option>Kumbakonam</option>
          <option>Madurai</option>
          <option>Mamallapuram</option>
          <option>Nagappattinam</option>
          <option>Nagercoil</option>
          <option>Palayamkottai</option>
          <option>Pudukkottai</option>
          <option>Rajapalayam</option>
          <option>Ramanathapuram</option>
          <option>Salem</option>
          <option>Thanjavur</option>
          <option>Tiruchchirappalli</option>
          <option>Tirunelveli</option>
          <option>Tiruppur</option>
          <option>Thoothukudi</option>
          <option>Udhagamandalam</option>
          <option>Vellore</option>

          {/* <!-- Telangana --> */}
          <option>Hyderabad</option>
          <option>Karimnagar</option>
          <option>Khammam</option>
          <option>Mahbubnagar</option>
          <option>Nizamabad</option>
          <option>Sangareddi</option>
          <option>Warangal</option>

          {/* <!-- Tripura --> */}
          <option>Agartala, Tripura</option>
          <option>Udaipur, Tripura</option>
          <option>Dharamnagar, Tripura</option>

          {/* <!-- Uttar Pradesh --> */}
          <option>Agra</option>
          <option>Aligarh</option>
          <option>Amroha</option>
          <option>Ayodhya</option>
          <option>Azamgarh</option>
          <option>Bahraich</option>
          <option>Ballia</option>
          <option>Banda</option>
          <option>Bara Banki</option>
          <option>Bareilly</option>
          <option>Basti</option>
          <option>Bijnor</option>
          <option>Bithur</option>
          <option>Budaun</option>
          <option>Bulandshahr</option>
          <option>Deoria</option>
          <option>Etah</option>
          <option>Etawah</option>
          <option>Faizabad</option>
          <option>Farrukhabad-cum-Fatehgarh</option>
          <option>Fatehpur</option>
          <option>Fatehpur Sikri</option>
          <option>Ghaziabad</option>
          <option>Ghazipur</option>
          <option>Gonda</option>
          <option>Gorakhpur</option>
          <option>Hamirpur</option>
          <option>Hardoi</option>
          <option>Hathras</option>
          <option>Jalaun</option>
          <option>Jaunpur</option>
          <option>Jhansi</option>
          <option>Kannauj</option>
          <option>Kanpur</option>
          <option>Lakhimpur</option>
          <option>Lalitpur</option>
          <option>Lucknow</option>
          <option>Mainpuri</option>
          <option>Mathura</option>
          <option>Meerut</option>
          <option>Mirzapur-Vindhyachal</option>
          <option>Moradabad</option>
          <option>Muzaffarnagar</option>
          <option>Partapgarh</option>
          <option>Pilibhit</option>
          <option>Prayagraj</option>
          <option>Rae Bareli</option>
          <option>Rampur</option>
          <option>Saharanpur</option>
          <option>Sambhal</option>
          <option>Shahjahanpur</option>
          <option>Sitapur</option>
          <option>Sultanpur</option>
          <option>Tehri</option>
          <option>Varanasi</option>

          {/* <!-- Uttarakhand --> */}
          <option>Almora</option>
          <option>Dehra Dun</option>
          <option>Haridwar</option>
          <option>Mussoorie</option>
          <option>Nainital</option>
          <option>Pithoragarh</option>

          {/* <!-- West Bengal --> */}
          <option>Alipore</option>
          <option>Alipur Duar</option>
          <option>Asansol</option>
          <option>Baharampur</option>
          <option>Bally</option>
          <option>Balurghat</option>
          <option>Bankura</option>
          <option>Baranagar</option>
          <option>Barasat</option>
          <option>Barrackpore</option>
          <option>Basirhat</option>
          <option>Bhatpara</option>
          <option>Bishnupur</option>
          <option>Budge Budge</option>
          <option>Burdwan</option>
          <option>Chandernagore</option>
          <option>Darjeeling</option>
          <option>Diamond Harbour</option>
          <option>Dum Dum</option>
          <option>Durgapur</option>
          <option>Halisahar</option>
          <option>Haora</option>
          <option>Hugli</option>
          <option>Ingraj Bazar</option>
          <option>Jalpaiguri</option>
          <option>Kalimpong</option>
          <option>Kamarhati</option>
          <option>Kanchrapara</option>
          <option>Kharagpur</option>
          <option>Cooch Behar</option>
          <option>Kolkata</option>
          <option>Krishnanagar</option>
          <option>Malda</option>
          <option>Midnapore</option>
          <option>Murshidabad</option>
          <option>Nabadwip</option>
          <option>Palashi</option>
          <option>Panihati</option>
          <option>Purulia</option>
          <option>Raiganj</option>
          <option>Santipur</option>
          <option>Shantiniketan</option>
          <option>Shrirampur</option>
          <option>Siliguri</option>
          <option>Siuri</option>
          <option>Tamluk</option>
          <option>Titagarh</option>
        </datalist>
      </form>
      {currentPosition && (
        <MapContainer
          center={currentPosition}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors'
          />
          <Marker position={currentPosition} icon={vehicleIcon} />
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="green" />
          )}
        </MapContainer>
      )}
    </>
  );
};

export default Map;
