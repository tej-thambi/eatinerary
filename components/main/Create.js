import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import CreateButton from './CreateButton'

export default function Create({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(galleryStatus);

    })();
  }, []);
  if(hasPermission === null) {
    return <View />
  }
  if(hasPermission === false) {
    return <View><Text>No access</Text></View>
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.padding}></Text>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Text style={styles.padding}></Text>
      <CreateButton title="Pick an image from camera roll" onPress={pickImage} />
      <Text style={styles.padding}></Text>
      <CreateButton title="Continue" onPress={() => navigation.navigate('Save', {image})} />
    </View>
  );
}


const styles = StyleSheet.create({
  padding: {
    padding: 2,
  }
})