import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Header, Message, Table, Icon, Container, Button, Responsive, Input, Grid, Modal, Label, Dropdown } from "semantic-ui-react";
import { push } from 'react-router-redux';
import axios from 'axios';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

const WAIT_INTERVAL = 1000;

import { addToList, addToListManual, addCapacity, addCount, trackText, trackTextManual, 
            exportInventory, removeForm, exportAllInventory, trackLocation, resetLocation, trackLocationScan
        } from "./../../actions/ExportActions";

import { getCodes } from "./../../actions/CodeActions";

import { getInventories } from "./../../actions/InventoryActions";
import { getLocations } from "./../../actions/LocationActions";

class ExportInventory extends Component {
    state = {
        errorInput: null,
        successInput: null,
        locationScanOn: false
    }
    componentWillMount() {
        const { token, dispatch } = this.props;
        dispatch(getCodes({token: token}));
        dispatch(getInventories({token: token}));
        dispatch(getLocations({token: token}));
        dispatch(resetLocation());
        this.timer = null;
    }

    handleManual = (e) => {
        const { dispatch } = this.props;
        dispatch(trackTextManual(e.target.value));
    }

    addManual = () => {
        const { dispatch } = this.props;
        const text = this.props.export.textManual;
        const { allCode } = this.props.code;
        const { backUpInv } = this.props.inventory;
        var data = {note: null};
        var mainSku = null;
        if (text && (text + "").trim() !== ""){
            allCode.forEach(function(code){
                  if (code.key === text){
                      data.text = text;
                      mainSku = code.mainSku;
                  }
            });
            if (data.text === text){
                backUpInv.forEach(function(inv){
                    if (mainSku === inv.sku){
                        data.capacity = inv.capacity;
                    }
                });

                if (!data.capacity){
                    data.note = "This product is not available!!!";
                }
            }
            else {
                data.text = text;
                data.note = "This code does not exists!!!";
            }

        }
        else {
            data.text = "";
        }
        dispatch(addToListManual(data));
    }

    handleChange = (e) => {
        const { dispatch } = this.props;
        clearTimeout(this.timer);
        dispatch(trackText(e.target.value));
        this.timer = setTimeout(this.handleCode, WAIT_INTERVAL);
    }

    handleCode = () => {
        const { dispatch } = this.props;
        const { text } = this.props.export;
        const { allCode } = this.props.code;
        const { backUpInv } = this.props.inventory;
        var data = {note: null};
        var mainSku = null;
        if (text && (text + "").trim() !== ""){
            allCode.forEach(function(code){
                  if (code.key === text){
                      data.text = text;
                      mainSku = code.mainSku;
                  }
            });
            if (data.text === text){
                backUpInv.forEach(function(inv){
                    if (mainSku === inv.sku){
                        data.capacity = inv.capacity;
                    }
                });

                if (!data.capacity){
                    data.note = "This product is not available!!!";
                }
            }
            else {
                data.text = text;
                data.note = "This code does not exists!!!";
            }

        }
        else {
            data.text = "";
        }
        dispatch(addToList(data));
    }

    handleCapacity = (e, id) => {
        const data = e.target.value;
        const { dispatch } = this.props;
        dispatch(addCapacity({id: id, data: data}));
    }

    handleCount = (e, id) => {
        const data = e.target.value;
        const { dispatch } = this.props;
        dispatch(addCount({id: id, data: data}));
    }

    onExport = (id) => {
        const { dispatch, token } = this.props;
        const { formList } = this.props.export;
        const { locations } = this.props.location;
        var data = null;
        var check = true;
        var checkLocation = false;
        formList.forEach(function(form){
            if (form.id === id){
                var capacity = form.capacity;
                var count = form.count;
                var location = form.location;                
                locations.forEach(loc => {
                    if (loc.name === location) {
                        loc.products.forEach(product => {                         
                            if (product.sku === form.code) {
                                checkLocation = true;
                            }
                        })
                    }
                })
                if (isNaN(capacity) || !Number.isInteger(Number(capacity)) || capacity === null || capacity <= 0 ||
                    isNaN(count) || !Number.isInteger(Number(count)) || count === null || count <= 0 ||
                    location === '' || location === null){
                    check = false;
                } else if (checkLocation){
                    data = {
                      code: form.code,
                      quantity: form.count * form.capacity,
                      capacity: form.capacity,
                      count: form.count,
                      location: form.location,
                      token: token
                    }
                    dispatch(exportInventory(data)).then(function(data){
                          dispatch(removeForm(id));
                          dispatch(resetLocation());
                    });
                }
            }
        });

        if (!check){
            this.setState({errorInput: "This input is invalid"});
        } else if (!checkLocation) {
            this.setState({errorInput: "This product does not exist in this location"});
        }
        else {
            this.setState({errorInput: null});
        }

    }

    onExportAll = () => {
        const { dispatch, token } = this.props;
        const { formList } = this.props.export;
        const { locations } = this.props.location;
        var check = true;
        var checkLocation = 0;
        if (formList.length !== 0){
            formList.forEach(function(form){
                var capacity = form.capacity;
                var count = form.count;
                var location = form.location;
                locations.forEach(loc => {
                    if (loc.name === location) {
                        checkLocation++;
                    }
                })
                if (isNaN(capacity) || !Number.isInteger(Number(capacity)) || capacity === null || capacity <= 0 ||
                    isNaN(count) || !Number.isInteger(Number(count)) || count === null || count <= 0 ||
                    location === '' || location === null){
                    check = false;
                }
                else {
                    form.quantity = form.count * form.capacity;
                }
            });

            if (check && checkLocation === formList.length){
                const data = {
                    formList,
                    token
                }
                dispatch(exportAllInventory(data)).then(function(data){
                    dispatch(resetLocation());
                });
            }
            else if (!check) {
                this.setState({errorInput: "One or more input is invalid"});
            } else if (checkLocation !== formList.length) {
                this.setState({errorInput: "One or more location do not exist"});
            }
        }
        else {
            this.setState({errorInput: "This list is empty"});
        }

    }

    onDelete = (id) => {
        const { dispatch } = this.props;
        dispatch(removeForm(id));
    }

    closeError = () => {
        this.setState({errorInput: null});
    }

    closeSuccess = () => {
        this.setState({successInput: null});
    }

    chooseLocation = (e, data, id) => {
        const { dispatch } = this.props;
        dispatch(trackLocation({location: data.value, id: id}));
    }

    resetLocation = () => {
        const { dispatch } = this.props;
        dispatch(resetLocation());
    }

    switchScan = () => {
        this.setState({locationScanOn: !this.state.locationScanOn});
    }

    handleLocationScan = (location, id) => {
        const { dispatch } = this.props;
        dispatch(trackLocationScan({location, id}));
    }

    render() {
        const { errorInput, successInput, locationScanOn } = this.state;
        const { formList, text, textManual, location, locationScan } = this.props.export;
        const { locations } = this.props.location;
        let error = null;
        let success = null;

        let locationList = [];
        let locationKey = 1;
        locations.forEach(location => {
            const data = {
                key: locationKey,
                text: location.name,
                value: location.name
            }
            locationList.push(data);
            locationKey += 1;
        })

        if (errorInput) {
            error = (
                <Message negative onDismiss={this.closeError}>
                    <Message.Header>ERROR</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        if (successInput) {
            success = (
                <Message positive onDismiss={this.closeSuccess}>
                    <Message.Header>SUCCESS</Message.Header>
                    <p>{successInput}</p>
                </Message>
            )
        }
        let exportsView = null;
        if (formList.length > 0){
            exportsView = formList.map(function (exportData) {
                return (
                    <Table.Row key={exportData.id}>
                        <Table.Cell>
                            {exportData.code}
                        </Table.Cell>
                        <Table.Cell>
                              {(exportData.capacity) ? <p>{exportData.capacity}</p> : <p>{exportData.note}</p>}
                        </Table.Cell>
                        <Table.Cell>
                              {(exportData.capacity) ? <Input defaultValue={exportData.count} onChange={(e) => this.handleCount(e, exportData.id)}/> : null}
                        </Table.Cell>
                        <Table.Cell className="tableRowVisible">
                          { (!locationScanOn) ? <Dropdown
                            onChange={(e, data) => this.chooseLocation(e, data, exportData.id)}
                            options={locationList}
                            placeholder='Choose a location'
                            selection
                            value={exportData.location}
                          /> : <Input value={exportData.location} onChange={(e) => this.handleLocationScan(e.target.value, exportData.id)}/> }
                        </Table.Cell>
                        <Table.Cell>
                            {(exportData.capacity) ? <Button size='tiny' primary onClick={() => this.onExport(exportData.id)}>Export</Button> : null}
                            <Button size='tiny' color='red' onClick={() => this.onDelete(exportData.id)}>Remove</Button>
                        </Table.Cell>
                    </Table.Row>
                )
            }, this);
        }

        let tableView = <h4>No Exports Found. Please Add Some </h4>
        if (formList.length > 0) {
            tableView = (
                <Table celled fixed sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Scanning Code</Table.HeaderCell>
                            <Table.HeaderCell>Box Capacity</Table.HeaderCell>
                            <Table.HeaderCell>Box Count</Table.HeaderCell>
                            <Table.HeaderCell>Location <Button primary onClick={this.switchScan}>Scan</Button></Table.HeaderCell>
                            <Table.HeaderCell>Options</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {exportsView}
                    </Table.Body>
                    <Table.Footer>
                      <Table.Row>
                        <Table.HeaderCell colSpan='5' textAlign='right'>
                            <Button primary onClick={this.onExportAll}>Export All</Button>
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Footer>
                </Table>
            )
        }

        return (
            <BaseLayout>
                <Segment textAlign='center' >
                    <Header as="h2">Export Inventory</Header>
                    {error}
                    {success}
                    <Container>
                        <Grid columns={2}>
                          <Grid.Row>
                              <Grid.Column className="columnForInput" textAlign='center'>
                                  <Label>For scan only</Label>
                                  <Input value={text} onChange={this.handleChange}/>
                              </Grid.Column>
                              <Grid.Column className="columnForButton" textAlign='center'>
                                  <Label>Input Manually</Label>
                                  <Input value={textManual} onChange={this.handleManual}/>
                                  <Button primary onClick={this.addManual}>Add</Button>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                          {tableView}
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function mapStatesToProps(state) {
    return {
        token: state.auth.token,
        export: state.exportData,
        auth: state.auth,
        inventory: state.inventory,
        code: state.code,
        location: state.location
    }
}

export default connect(mapStatesToProps)(ExportInventory);
