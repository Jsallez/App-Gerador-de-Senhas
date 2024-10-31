import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, Animated, Image, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Clipboard from 'expo-clipboard';

const App = () => {
  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialChars: true,
    easyToRead: false,
  });
  const [buttonScale] = useState(new Animated.Value(1));
  const [history, setHistory] = useState([]);

  const generatePassword = () => {
    const easyToReadChars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*-';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%&*-';

    let charset = '';

    if (!options.uppercase && !options.lowercase && !options.numbers && !options.specialChars && !options.easyToRead) {
      Alert.alert('Erro', 'Selecione pelo menos uma opção de caracteres.');
      return;
    }

    if (options.easyToRead) {
      charset = easyToReadChars;
    } else {
      if (options.uppercase) charset += uppercaseChars;
      if (options.lowercase) charset += lowercaseChars;
      if (options.numbers) charset += numbers;
      if (options.specialChars) charset += specialChars;
    }

    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
    updateHistory(newPassword);
  };

  const updateHistory = (newPassword) => {
    setHistory((prevHistory) => {
      const updatedHistory = [newPassword, ...prevHistory];
      return updatedHistory.slice(0, 5);
    });
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert('Senha copiada!', 'A senha foi copiada para a área de transferência.');
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => generatePassword());
  };

  const toggleOption = (option) => {
    setOptions({ ...options, [option]: !options[option] });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.png')} // Verifique se o caminho está correto
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Gerador de Senhas</Text>

      <View style={styles.passwordContainer}>
        <Text style={styles.password}>{password || 'Sua senha aparecerá aqui'}</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={8}
        maximumValue={20}
        step={1}
        value={passwordLength}
        onValueChange={(value) => setPasswordLength(value)}
      />
      <Text style={styles.passwordLength}>Comprimento: {passwordLength}</Text>

      <View style={styles.optionsContainer}>
        {['uppercase', 'lowercase', 'numbers', 'specialChars', 'easyToRead'].map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, options[option] && styles.optionButtonActive]}
            onPress={() => toggleOption(option)}
          >
            <Text style={styles.optionButtonText}>
              {option === 'uppercase' ? 'Maiúsculas' :
                option === 'lowercase' ? 'Minúsculas' :
                option === 'numbers' ? 'Números' :
                option === 'specialChars' ? 'Especiais' :
                'Fácil de Ler'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={animateButton} style={styles.generateButton}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Text style={styles.generateButtonText}>Gerar Senha</Text>
        </Animated.View>
      </TouchableOpacity>

      <Button title="Copiar Senha" onPress={() => copyToClipboard(password)} />

      <ScrollView style={styles.historyContainer}>
        {history.map((pass, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyText}>{pass}</Text>
            <Button title="Copiar" onPress={() => copyToClipboard(pass)} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#121921',
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    height: 80,
    marginBottom: 10,
    marginTop: 20, // Ajuste para baixar a logo
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  passwordContainer: {
    backgroundColor: '#122337',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  password: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  slider: {
    width: '90%',
    marginBottom: 10,
  },
  passwordLength: {
    fontSize: 16,
    color: '#fff',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#d3d3d3',
    padding: 8,
    margin: 4,
    borderRadius: 8,
  },
  optionButtonActive: {
    backgroundColor: '#325f8a',
  },
  optionButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
  },
  historyContainer: {
    width: '90%',
    marginTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#122337',
    marginVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  historyText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default App;

