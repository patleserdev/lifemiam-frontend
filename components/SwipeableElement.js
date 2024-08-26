import React, { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { Animated, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from "../utilities/color";
import { setList,updateOneElementOfList } from "../reducers/lists";

const rightButtons = ['Acheter'];
const btnWidth = 80;
const offset = [-btnWidth * rightButtons.length, btnWidth];

export default function SwipableItem({name, quantity, unit, buyed,onToggleBuyed}) 
{

    // const URL = "http://192.168.0.53:3000";
    const URL = "https://lifemiam-backend.vercel.app";

    let panValue = { x: 0, y: 0 };
    let isOpenState = useRef(true).current; // Set to true initially
    const pan = useRef(new Animated.ValueXY({ x: -btnWidth * rightButtons.length, y: 0 })).current; // Start with open position
    const itemTranslate = pan.x.interpolate({ inputRange: offset, outputRange: offset, extrapolate: 'clamp' });
    
    const userToken = useSelector((state) => state.user.value.token);
    const [isOpen, setIsOpen] = useState(true); // Set to true initially
    const [isBuyed, setIsBuyed] = useState(buyed);
    const dispatch = useDispatch();
    const userList = useSelector((state) => state.lists.value);
    
    const translateRightBtns = pan.x.interpolate({ inputRange: [0, rightButtons.length * btnWidth], outputRange: [0, rightButtons.length * btnWidth], extrapolate: 'clamp' });

    useEffect(() => {
        pan.addListener(value => {
            panValue = value;
        });
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponderCapture: (e, g) => Math.abs(g.dx) > 10,
            onMoveShouldSetPanResponder: (e, g) => false,
            onPanResponderGrant: () => {
                pan.setOffset({ x: panValue.x, y: panValue.y });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (e, g) => {
                pan.flattenOffset();

                if (g.vx < -0.5 || g.dx < -btnWidth * rightButtons.length / 2) {
                    if (isOpenState && g.dx < 0) {
                        reset();
                        return;
                    }
                    move(true);
                    return;
                }
                reset();
            },
            onPanResponderTerminate: () => {
                reset();
            },
        }),
    ).current;

    const reset = () => {
        isOpenState = false;
        setIsOpen(false);
        Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            bounciness: 0
        }).start();
    };

    const move = (toLeft) => {
        isOpenState = true;
        setIsOpen(true);
        Animated.spring(pan, {
            toValue: { x: toLeft ? -btnWidth * rightButtons.length : btnWidth, y: 0 },
            useNativeDriver: true,
            bounciness: 0
        }).start();
    };

    const buyedItem = () => {
            setIsBuyed(!isBuyed);
            const newBuyedValue = !isBuyed;
            onToggleBuyed(name, newBuyedValue);  // Appeler la fonction de rappel
        // setIsBuyed(!isBuyed)
        // // let newList = userList.map(e => {
        // //     if (e.name === name) {
        // //         return { ...e, isBuyed: !isBuyed };
        // //     }
        // //     return e;
        // // });
        // console.log(userList[0])
        // dispatch(updateOneElementOfList({menuId:menuid ,name:name ,isbuyed:!isBuyed}));
           
    
            // let list=userList.find((e)=> e._id == idlist )
            // console.log('newlist',list)
            // let newList = userList.map(e => {
            //     if (e.name === name) {
            //         return { ...e, isBuyed: !isBuyed };
            //     }
            //     return e;
            // });

   

            
            // dispatch(setList(newList));
            // fetch(`${URL}/shop/updatelist/${idlist}`, {
            //     method: "PUT",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         token: userToken, 
            //         ingredients: newList
            //     }),
            // })
            // .then(response => response.json())
            // .then(data => console.log(data));
        };


    return (
        <View style={styles.container}>
            <Animated.View style={[styles.btnContainer, { transform:[{ translateX: translateRightBtns }], alignSelf: 'flex-end' }]}>
                <TouchableOpacity onPress={buyedItem} 
                    style={ [styles.btn, isBuyed ? { backgroundColor: Colors.YELLOW } : { backgroundColor: Colors.DARK_GREEN }]}>
                    <Text style={!isBuyed ? {textAlign:'center',color:'#fff' } : {textAlign:'center'  } }>
                        {!isBuyed ? 'Acheter' : 'Reposer' }</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[!isOpen ? styles.item : styles.itemOpen, { transform: [{ translateX: itemTranslate }] }]} {...panResponder.panHandlers} >
                <Text style={styles.txt}>{name}</Text>
                <Text style={styles.txt}>{quantity} {unit}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: '100%',
        marginBottom: 3,
    },
    item: {
        height: '100%',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: Colors.LIGHT_GREEN,
        paddingHorizontal:20
    },
    itemOpen: {
        height: '100%',
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 100,
        backgroundColor: Colors.LIGHT_GREEN,
        transform: [{translateX: '50%'}],
        paddingHorizontal:20
    },
    txt: {
        color: '#fff',
        letterSpacing: 1,
        textAlign:'left'
    },
    btnContainer: {
        height: '100%',
        position: 'absolute',
        flexDirection: 'row'
    },
    btn: {
        height: '100%',
        width: btnWidth,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})