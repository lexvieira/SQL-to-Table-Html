import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from 'react-leaflet';
// import L from 'leaflet';

// import { LeafletMouseEvent } from "leaflet";
import api from "../../services/api";
import axios from 'axios';

import Dropzone from "../../components/Dropzone";

import "./styles.css";
import logo from "../../assets/logo.svg";

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    //MapPositions
    const [initialPosition, setInitialPosition] = useState<[number, number]>([19.3786057, 99.5117335]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);

    const [cities, setCities] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [selectFile, setSelectFile] = useState<File>();

    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === "0") {
            return;
        }
            axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
        });
    }, [selectedUf]);

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }

    const Markers = () => {
        const map = useMapEvents({
            click(event) {
                setSelectedPosition([
                    event.latlng.lat,
                    event.latlng.lng
                ]);
            }, locationfound(event) {
                console.log(`Location Found: Lat ${event.latlng.lat} Long ${event.latlng.lng}`);
                map.flyTo(event.latlng, map.getZoom());
                map.panTo(event.latlng);
                // map.setZoom(15);
                
                setInitialPosition([event.latlng.lat, event.latlng.lng]);                
            }
        });
        map.locate();
        return (
                <>
                    { initialPosition ?
                        <Marker
                            key={String(initialPosition[0])}
                            position={initialPosition}
                        >
                            <Popup>
                                Sua Posição
                            </Popup>
                        </Marker>
                        : null
                    }
                    {   selectedPosition ?
                            <Marker
                                key={String(selectedPosition[0])}
                                position={selectedPosition}
                                interactive={true}
                            >
                                <Popup>
                                    Ponto de Coleta
                                </Popup>
                            </Marker>
                        : null              
                    }
                </>
        )
    }


    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleSelectedItem(id: number) {
        const alreadSelected = selectedItems.findIndex(item => item === id);

        if (alreadSelected >= 0) {
            const filtereditems = selectedItems.filter(item => item !== id);
            setSelectedItems(filtereditems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        // const data = {
        //     name,
        //     email,
        //     whatsapp,
        //     uf,
        //     city,
        //     latitude,
        //     longitude,
        //     items
        // }
        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectFile) {
            data.append('image', selectFile);
        }

        await api.post('points', data);

        alert('Ponto de Coleta Cadastrado');

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para o home
            </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>
                    Cadastro do <br /> ponto de coleta
                </h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                id="whatsapp"
                                name="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endreço no mapa</span>
                    </legend>

                    <MapContainer center={initialPosition} zoom={15}>
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Markers />
                    </MapContainer>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectedCity}
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Insira seu logo ou imagem do seu ponto de coleta</h2>
                    </legend>
                    <Dropzone onFileUploaded={setSelectFile} />
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                    </legend>

                    <ul className="items-grid">

                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''} >
                                <img src={item.image_url} alt={item.title} />
                                <span>
                                    {item.title}
                                </span>
                            </li>
                        ))}

                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de Coleta
                </button>

            </form>
        </div>
    );
}

export default CreatePoint;