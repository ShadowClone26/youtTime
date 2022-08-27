import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Btn, { Icbtn } from "../comps/Btns";
import {colors, fsize} from "../constants/colors";

// let dateobj = new Date();
export default function Watch({navigation}){
    const [time, settime] = useState(new Date());

    const [modalvis, setmodalvis] = useState(false);
  
    function showmodal() {
        console.log("hitted");
        setmodalvis(true);
    }
  

    useEffect(() => {
        
      let timeinterval = setInterval(() => {
        settime(new Date());
      }, 100);
    
      return () => {
        clearInterval(timeinterval);
      }
    }, [])
    
    
    
    function hidemodal() {
        console.log("presses");
    }
    function gotopage(pagename) {
        navigation.replace(pagename);
    }

    return(
        <>
          <Btn onp={showmodal}>
                <Text style={styles.currentpage}>Watch</Text>
            </Btn>
            {
                    modalvis&&
                    <Modal visible={modalvis} onRequestClose={()=>setmodalvis(false)} transparent={true} >
                    <View style={styles.optionmodalmaindiv}>
                    <Text style={[styles.options,{backgroundColor:colors.mainmedium,}]}>Watch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"stopwatch")}>StopWatch</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"events")}>Events</Text>
                    <Text style={styles.options} onPress={gotopage.bind(this,"timer")}>timer</Text>
                    </View>
                    <Pressable onPress={()=>setmodalvis(false)} style={{flex:1,backgroundColor:colors.mainlight,opacity:0.2,zIndex:-20}}></Pressable>
                    </Modal>
                 }
        <Pressable style={styles.mainscreen} onPress={hidemodal}>     
            <View style={styles.clockdiv}>
            <View style={styles.mainclockdiv}>
                <Text style={styles.hourtext}>
                    {time.getHours()<10?
                    "0"+time.getHours().toString():
                    time.getHours()>13?
                    time.getHours()-12:time.getHours()
                }
                </Text>
                <Text style={styles.dividerdots}>
                    :
                </Text>
                <Text style={styles.hourtext}>
                    {time.getMinutes()<10?
                    "0"+time.getMinutes().toString():
                    time.getMinutes().toString()}
                </Text>
                <Text style={styles.dividerdots}>
                    :
                </Text>
                <Text style={styles.hourtext}>
                    {time.getSeconds()<10?
                    "0"+time.getSeconds().toString():
                    time.getSeconds().toString()}
                </Text>
                
            </View>
            <View style={styles.minisdiv}>
            <Text style={[styles.minitext,{opacity:0.4,}]}>
                {time.getMilliseconds().toString().slice(0,1)}
            </Text>
            <Text style={styles.minitext}>
                {time.getHours()>11?"PM":"AM"}
            </Text>
            </View>
            </View>
            <View style={styles.datediv}>
                    <Text style={styles.date}>
                        {time.getDate()}
                         / 
                        {time.getMonth()}
                         / 
                        {time.getFullYear()}
                    </Text>
            </View>
        </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    mainscreen:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"black",
        zIndex:-20,
    },pagenamediv:{
        backgroundColor:"red",
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:10,
        marginHorizontal:30,
      },pagename:{
        backgroundColor:"blue",
        fontSize:fsize.textmedium
      },menudiv:{
        backgroundColor:"red",
      },clockdiv:{
        flexDirection:"row",
        width:"100%",
        paddingHorizontal:15,
    },mainclockdiv:{
        // backgroundColor:"red",
        flex:1, 
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"center",
        paddingHorizontal:10,
    },hourtext:{
        fontSize:fsize.timetext,
        color:"white"
    },dividerdots:{
        fontSize:fsize.heading,
        color:"white",
        alignItems:"center",
        justifyContent:"center",
    },minisdiv:{
        // backgroundColor:"blue",
        paddingHorizontal:10,
        alignItems:"center",
        justifyContent:"center",
    },minitext:{
        fontSize:fsize.headingmedium,
        color:"white",
        // paddingVertical:10,
    },datediv:{
        // backgroundColor:"red",
        paddingVertical:10,

    },currentpage:{
        position:"absolute",
        top:20,right:0,left:0,
        backgroundColor:colors.mainmedium,
        color:"black",
        marginHorizontal:50,
        textAlign:"center",
        paddingVertical:10,
        borderRadius:10,
        letterSpacing:2,
        textTransform:"uppercase"
        // zIndex:20,
    },date:{
        // backgroundColor:"blue",
        color:"white",
        fontSize:fsize.headingmedium,
        letterSpacing:3,
        opacity:0.8,
        // backgroundColor:"red",
    },optionmodalmaindiv:{
        backgroundColor:colors.mainlight,
        position:"absolute",
        top:15,right:50,left:50,
        borderRadius:10,
        paddingHorizontal:15,
        paddingVertical:10,
        alignItems:"center",
    },options:{
        // backgroundColor:"blue",
        textTransform:"uppercase",
        letterSpacing:2,
        color:"black",
        width:"100%",
        textAlign:"center",
        borderRadius:10,
        paddingVertical:5,
    }

})