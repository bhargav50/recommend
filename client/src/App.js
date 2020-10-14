import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logo from './logo.svg';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Divider,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';

import './App.css';
import * as assetService from './services/asset';

const useStyles = makeStyles(theme => ({
  selected: {
    height: 400,
    maxWidth: 400,
    margin: 'auto'
  },
  searchInput: {
    width: 300,
    marginBottom: 40
  },
  suggestions: {
    display: 'flex',
    width: 1000,
    margin: 'auto',
    justifyContent: 'space-between'
  },
  suggestion: {
    minWidth: 300,
  },
  suggestionImage: {
    height: 150
  }
}))

const isDev = process.env.NODE_ENV !== 'production';

const BASE_URL = isDev ? 'http://localhost:3001' : '';

function App() {
  const classes = useStyles();
  const [selectedAsset, setSelectedAsset] = useState({ asset_id: '' });
  const [assets, setAssets] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    assetService.fetchAssets()
      .then(setAssets);
  }, []);

  const fetchSuggestions = async (id) => {
    assetService.fetchSuggestions(id)
      .then(setSuggestions);
  }

  const handleChange = e => {
    const targetAsset = assets.find(asset => asset.asset_id === e.target.value);
    setSelectedAsset(targetAsset);
    fetchSuggestions(e.target.value);
  }

  return (
    <div className="App">
      <div className={classes.selected}>
        {
          selectedAsset
          && selectedAsset.asset_id
          && !isNaN(selectedAsset.asset_id)
          && (
            <Card className={classes.suggestion}>
              <CardActionArea>
                <CardMedia
                  className={classes.suggestionImage}
                  image={selectedAsset.image_url}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {selectedAsset.title}
                  </Typography>
                  <Typography gutterBottom>
                    Pre Tax Return: {selectedAsset.pre_tax_return} %
                  </Typography>
                  <Typography gutterBottom>
                    Minimum Investment: {selectedAsset.min_investment} Rs.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )
        }
      </div>
      <FormControl className={classes.searchInput}>
        <InputLabel id="demo-simple-select-helper-label">
          Select an asset
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedAsset ? selectedAsset.asset_id : null}
          onChange={handleChange}
        >
          {
            assets.map((asset, index) => (
              <MenuItem
                key={index}
                value={asset.asset_id}>
                {asset.title}
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
      {
        Array.isArray(suggestions)
        && suggestions.length > 0
        && (
          <div className={classes.suggestions}>
          {
            suggestions.map((suggestion, index) => (
            <Card key={index} className={classes.suggestion}>
              <CardActionArea>
                <CardMedia
                  className={classes.suggestionImage}
                  image={suggestion.image_url}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {suggestion.title}
                  </Typography>
                  <Typography gutterBottom>
                    Pre Tax Return: {suggestion.pre_tax_return} %
                  </Typography>
                  <Typography gutterBottom>
                    Minimum Investment: {suggestion.min_investment} Rs.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
          }
          </div>
        )
      }
    </div>
  );
}

export default App;
