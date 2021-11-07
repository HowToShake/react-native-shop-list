import React, {useEffect} from 'react'
import {Text} from 'native-base'
const SharedPreferences = require('react-native-shared-preferences');

const Settings = () => {
    useEffect(() => {
        SharedPreferences.setItem("key","value");
    })

    SharedPreferences.getItem("key", function(value: any){
        console.log('valueee', value);
    });

    return(
        <Text>Settings</Text>
    )
}
export default Settings
