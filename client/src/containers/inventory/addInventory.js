import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Header, Segment, Input, Label, Form, Button, Message, Container, Dropdown, Grid } from "semantic-ui-react";
import { push } from 'react-router-redux';

import BaseLayout from "./../baseLayout";

import './../../styles/custom.css';

import { addInventory, setUpdatingInventory, updateInventory, fillingData, getInventories,
         clearFailedProducts, clearCompletedProducts } from "./../../actions/InventoryActions";

import { getQualities, getTypes, getPatterns, getColors, getSizes, getUnits,
          chooseQuality, chooseType, choosePattern, chooseColor, chooseSize, chooseUnit, reset
        } from "./../../actions/FeatureActions";

function validate(values) {
    var errors = {
        batch: {}
    };
    const { price, capacity } = values;
    if (!price || (price + "").trim() === "") {
        errors.price = "Price is Required";
    }
    else if (isNaN(price)) {
        errors.price = "Price must be a number";
    }
    else if (price < 0){
        errors.price = "Price must be larger than or equal to 0";
    }

    if (!capacity || (capacity + "").trim() === "") {
        errors.capacity = "Box Capacity is Required";
    }
    else if (isNaN(capacity)){
        errors.capacity = "Box Capacity must be a number";
    }
    else if (capacity < 0){
        errors.capacity = "Box Capacity must be larger than or equal to 0";
    }
    return errors;
}

class AddInventory extends Component {
    state = {
       addingError: null,
       addingComplete: null,
       errorInput: null
    };
    componentWillMount() {
        const { dispatch } = this.props;
        const { token } = this.props.auth;
        dispatch(getInventories({token: token}));
        dispatch(getQualities({ token: token }));
        dispatch(getTypes({ token: token }));
        dispatch(getPatterns({ token: token }));
        dispatch(getColors({ token: token }));
        dispatch(getSizes({ token: token }));
        dispatch(getUnits({ token: token }));
    }
    renderField({ input, meta: { touched, error }, ...custom }) {
        const hasError = touched && error !== undefined;
        return (
            <div>
                <Input type="text" error={hasError} fluid {...input} {...custom} />
                {hasError && <Label basic color="red" pointing>{error}</ Label>}
            </div>
        )
    }
    handleChange = (e, data) => {
          const { dispatch } = this.props;
          if (data.placeholder == "Choose an quality"){
              dispatch(chooseQuality(data.value));
          }
          else if (data.placeholder == "Choose an type"){
              dispatch(chooseType(data.value));
          }
          else if (data.placeholder == "Choose an pattern"){
              dispatch(choosePattern(data.value));
          }
          else if (data.placeholder == "Choose an color"){
              dispatch(chooseColor(data.value));
          }
          else if (data.placeholder == "Choose an size"){
              dispatch(chooseSize(data.value));
          }
          else if (data.placeholder == "Choose an unit"){
              dispatch(chooseUnit(data.value));
          }
          else {
              alert("undefined");
          }
    }
    generateData = () => {
        const { dispatch } = this.props;
        const { quality, type, pattern, color, size, unit,
                qualities, types, patterns, colors, sizes, units } = this.props.feature;

        if ((quality === null) || (type === null) || (pattern === null) || (color.length === 0) || (unit === null)){
            return {generatedSKU: null, generatedDesc: null, unitCode: null};
        }
        else {
            var unitCode = null;
            var skuList = [];
            var descList = [];
            for (var i = 0; i < color.length; i++){
                var sku = "";
                var desc = "";
                qualities.forEach(function(item){
                    if (item.description === quality){
                        sku = sku.concat(item.key).concat("-");
                        desc = desc.concat(item.description).concat("-");
                    }
                });
                types.forEach(function(item){
                    if (item.description === type){
                        sku = sku.concat(item.key).concat("-");
                        desc = desc.concat(item.description).concat("-");
                    }
                });
                patterns.forEach(function(item){
                    if (item.description === pattern){
                        sku = sku.concat(item.key).concat("-");
                        desc = desc.concat(item.description).concat("-");
                    }
                });
                colors.forEach(function(item){
                    if (item.description === color[i]){
                        sku = sku.concat(item.key);
                        desc = desc.concat(item.description);
                    }
                });
                sizes.forEach(function(item){
                    if (item.description === size){
                        sku = sku.concat("-").concat(item.key);
                        desc = desc.concat("-").concat(item.description);
                    }
                });
                units.forEach(function(item){
                    if (item.description === unit){
                        unitCode = item.key;
                        //desc = desc.concat("-").concat(item.description);
                    }
                });
                skuList.push(sku);
                descList.push(desc);
                //console.log(skuList);
                //console.log(desc);
            }
            const data = {
                generatedSKU: skuList,
                generatedDesc: descList,
                unitCode: unitCode
            }
            //dispatch(fillingData(data));
            this.setState({addingError: null});
            return data;
        }
    }

    onSubmit(values, dispatch) {
        const { generatedSKU, generatedDesc, unitCode } = this.generateData();

        const { token } = this.props.auth;
        const { inventories } = this.props.inventory;
        const store = [];
        if ((generatedSKU === null) || (generatedDesc === null) || (unitCode === null)){
            this.setState({errorInput: "Invalid Input"})
        }
        else {
            /*var count = checkSKU(inventories, generatedSKU);
            if(count.length > 0){
                var errorMessage = "";
                count.forEach(function(sku){
                    errorMessage = errorMessage + sku + " | ";
                    var index = generatedSKU.indexOf(sku);
                    generatedSKU.splice(index,1);
                    generatedDesc.splice(index,1);
                });
                this.setState({addingError: errorMessage});
            }

            if (generatedSKU.length > 0)
            {
                values.token = token;
                values.unit = unitCode;
                var list = [];
                for (var i = 0; i < generatedSKU.length; i++){
                    const data = {
                        sku: generatedSKU[i],
                        desc: generatedDesc[i]
                    }
                    list.push(data);
                }
                values.list = list;

                dispatch(addInventory(values)).then(function(data){
                      //dispatch(push("/inventory"));
                      dispatch(reset());
                });

                var completeMessage = "";
                generatedSKU.forEach((sku) => {completeMessage = completeMessage + sku + " | "});
                this.setState({addingComplete: completeMessage});
            }*/
            values.token = token;
            values.unit = unitCode;
            var list = [];
            for (var i = 0; i < generatedSKU.length; i++){
                const data = {
                    sku: generatedSKU[i],
                    desc: generatedDesc[i]
                }
                list.push(data);
            }
            values.list = list;
            dispatch(addInventory(values)).then(function(data){
                  //dispatch(push("/inventory"));
                  dispatch(reset());
            });
            this.setState({errorInput: null});
        }
    }

    handleFail = () => {
       const { dispatch } = this.props;
       dispatch(clearFailedProducts());
    }

    handleComplete = () => {
        const { dispatch } = this.props;
        dispatch(clearCompletedProducts());
    }

    render() {
        const { handleSubmit, pristine, initialValues, errors, submitting } = this.props;
        const { isAddingInventory, addingInventoryError, inventory,
                generatedSKU, generatedDesc, unitCode, completedProducts, failedProducts } = this.props.inventory;
        const { qualities, types, patterns, colors, sizes, units,
                quality, type, pattern, color, size, unit } = this.props.feature;
        const { addingError, addingComplete, errorInput } = this.state;
        var qualityList = [];
        var typeList = [];
        var patternList = [];
        var colorList = [];
        var sizeList = [{key:1, text:'No Size', value:''}];
        //var unitList = [{key:1, text:'No Unit', value:''}];
        var unitList = [];

        var qualityKey = 1;
        var typeKey = 1;
        var patternKey = 1;
        var colorKey = 1;
        var sizeKey = 2;
        var unitKey = 1;

        if (qualities.length > 0){
            qualities.forEach(function(quality){
                const data = {
                    key: qualityKey,
                    text: quality.description,
                    value: quality.description
                }
                qualityList.push(data);
                qualityKey += 1;
            });
        }

        if (types.length > 0){
            types.forEach(function(type){
                const data = {
                    key: typeKey,
                    text: type.description,
                    value: type.description
                }
                typeList.push(data);
                typeKey += 1;
            });
        }

        if (patterns.length > 0){
            patterns.forEach(function(pattern){
                const data = {
                    key: patternKey,
                    text: pattern.description,
                    value: pattern.description
                }
                patternList.push(data);
                patternKey += 1;
            });
        }

        if (colors.length > 0){
            colors.forEach(function(color){
                const data = {
                    key: colorKey,
                    text: color.description,
                    value: color.description
                }
                colorList.push(data);
                colorKey += 1;
            });
        }

        if (sizes.length > 0){
            sizes.forEach(function(size){
                const data = {
                    key: sizeKey,
                    text: size.description,
                    value: size.description
                }
                sizeList.push(data);
                sizeKey += 1;
            });
        }

        if (units.length > 0){
            units.forEach(function(unit){
                const data = {
                    key: unitKey,
                    text: unit.description,
                    value: unit.description
                }
                unitList.push(data);
                unitKey += 1;
            });
        }
        //console.log(qualityList);
        let error = null;
        let failedMessage = null;
        let completedMessage = null;
        if (addingInventoryError) {
            error = (
                <Message negative>
                    <Message.Header>Error while Adding Inventory</Message.Header>
                    <p>{addingInventoryError}</p>
                </Message>
            )
        }
        if (errorInput) {
            error = (
                <Message negative>
                    <Message.Header>Error while Inputing Value</Message.Header>
                    <p>{errorInput}</p>
                </Message>
            )
        }
        if (failedProducts) {
            failedMessage = (
                <Message negative onDismiss={() => this.handleFail()}>
                    <Message.Header>Failed Products</Message.Header>
                    <p>{failedProducts}</p>
                </Message>
            )
        }

        if (completedProducts) {
            completedMessage = (
                <Message positive onDismiss={() => this.handleComplete()}>
                    <Message.Header>Successful Products</Message.Header>
                    <p>{completedProducts}</p>
                </Message>
            )
        }
        return (
            <BaseLayout>
                <Segment textAlign='center'>
                  <Container>
                    <Header as="h2">Add Inventory</Header>
                    {error}
                    {failedMessage}
                    {completedMessage}
                    <Container className="featureBox">
                      <Grid columns={3} divided>
                        <Grid.Row>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange}
                              options={qualityList}
                              placeholder='Choose an quality'
                              selection
                              value={quality}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange}
                              options={typeList}
                              placeholder='Choose an type'
                              selection
                              value={type}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange}
                              options={patternList}
                              placeholder='Choose an pattern'
                              selection
                              value={pattern}
                            />
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                          <Grid.Column>
                            <Dropdown
                              fluid
                              multiple
                              onChange={this.handleChange}
                              options={colorList}
                              placeholder='Choose an color'
                              selection
                              value={color}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange}
                              options={sizeList}
                              placeholder='Choose an size'
                              selection
                              value={size}
                            />
                          </Grid.Column>
                          <Grid.Column>
                            <Dropdown
                              onChange={this.handleChange}
                              options={unitList}
                              placeholder='Choose an unit'
                              selection
                              value={unit}
                            />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Container>
                    {/*<Container className="featureBox">
                        <Button primary onClick={() => this.generateData()}>Create</Button>
                    </Container>
                    <Container className="featureBox">
                      <Grid.Row className="generatedRow">
                        <Label basic pointing='right'>SKU</Label>
                        {generatedSKU.map((sku, index) => <p key={index} className="generatedText">{sku}</p>)}
                      </Grid.Row>
                      <Grid.Row className="generatedRow">
                        <Label basic pointing='right'>Description</Label>
                        {generatedDesc.map((desc, index) => <p key={index} className="generatedText">{desc}</p>)}
                      </Grid.Row>
                      <Grid.Row>
                        <Label basic pointing='right'>Unit</Label><p className="generatedText">{unitCode}</p>
                      </Grid.Row>
                    </Container>*/}
                    <Form onSubmit={handleSubmit(this.onSubmit.bind(this))} loading={isAddingInventory}>
                        <Form.Field inline>
                            <Label>Box Capacity</Label>
                            <Field name="capacity" placeholder="Enter the Box Capacity" component={this.renderField}></Field>
                        </Form.Field>
                        <Form.Field inline>
                            <Label>Price</Label>
                            <Field name="price" placeholder="Enter the Price" component={this.renderField}></Field>
                        </Form.Field>
                        <Button primary loading={submitting} disabled={submitting}>Add Product</Button>
                    </Form>
                    </Container>
                </Segment>
            </BaseLayout>
        )
    }
}

function checkSKU(inventories, sku){
    var count = [];
    inventories.forEach(function(inventory){
        if (sku.includes(inventory.sku)){
            count.push(inventory.sku)
        }
    });
    return count;
}

function mapStatesToProps(state) {
    const initialValues = state.inventory.defaultValue;
    //console.log(initialValues);
    return {
        initialValues: initialValues,
        auth: state.auth,
        inventory: state.inventory,
        feature: state.feature
    }
}

export default connect(mapStatesToProps)(reduxForm({
    form: "AddInventory",
    validate
})(AddInventory));
