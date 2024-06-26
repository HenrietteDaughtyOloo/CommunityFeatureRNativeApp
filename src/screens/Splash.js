import React,{ useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet,Text,View, Animated } from "react-native";

export default function SplashScreen({navigation}){
    const [isTextGlowing, setIsTextGlowing] = useState(false);

    useEffect(()=>{
        setTimeout(() => {
            handleGetToken();            
        }, 5000);
    });

    const handleGetToken= async()=>{
        const dataToken = await AsyncStorage.getItem('AccessToken')
        if(!dataToken){
          navigation.replace("Login")
        }
        else{navigation.replace("Home")};
      }

      
      const useGlow = (isGlowing) => {
        const opacityValue = React.useRef(new Animated.Value(0.5)).current;
        useEffect(() => {
            const animate = Animated.loop(
              Animated.sequence([
                Animated.timing(opacityValue, {
                  toValue: 1,
                  duration: 1000, 
                  useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                  toValue: 0.5,
                  duration: 1000,
                  useNativeDriver: true,
                }),
              ])
            ).start();
      
            return () => animate;
          }, [isGlowing]); 
      
          return opacityValue;
        };
      
          
      const textOpacity = useGlow(isTextGlowing); 

      return(
        <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
        IzolaCommuno
      </Animated.Text>
        </View>
      );
    
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'black',

    },
    text:{
        fontWeight:'800',
        fontSize:30,
        color:'#11cfc5', 
        paddingHorizontal: 20,
       
    },
});