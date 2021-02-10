import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import __beer from '../media/beer.png';
import __drinks from '../media/drinks.png';
import __food from '../media/food.png';
import __dessert from '../media/cake.png'
import __bar from '../media/bar.png';

export default function MainPage(props) {

    const classes = useStyles();

    return(
        <div className={classes.MainPage}>
            <Card className={classes.root} elevation={5} onClick={() => props.setComponent(1)}>
            <CardActionArea style={{padding: 15}}>
                <img src={__beer} className={classes.img} alt="Birre" />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Birre
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Card>
            <Card className={classes.root} elevation={5} onClick={() => props.setComponent(2)}>
            <CardActionArea style={{padding: 15}}>
                <img src={__food} className={classes.img} alt="Piatti" />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Piatti
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Card>
            <Card className={classes.root} elevation={5} onClick={() => props.setComponent(3)}>
            <CardActionArea style={{padding: 15}}>
                <img src={__drinks} className={classes.img} alt="Bibite" />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Bibite
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Card>
            <Card className={classes.root} elevation={5} onClick={() => props.setComponent(4)}>
            <CardActionArea style={{padding: 15}}>
                <img src={__dessert} className={classes.img} alt="Dolci" />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Dolci
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Card>
            <Card className={classes.root} elevation={5} onClick={() => props.setComponent(5)}>
            <CardActionArea style={{padding: 15}}>
                <img src={__bar} className={classes.img} alt="bar" />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        Bar
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Card>
        </div>
    );
}

const useStyles = makeStyles({
    MainPage: {
        textAlign: '-webkit-center',
        marginTop: 80,
        marginBottom: 100,
    },
    root: {
      width: 220,
      height: 220,
      margin: 20,
      borderRadius: 10,
      backgroundColor: '#61616185',
      color: '#fff'
    },
    img: {
        margin: '15 15 0 15',
        width: 140,
        height: 140
    }
  });