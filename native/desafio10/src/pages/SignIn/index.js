import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import logo from '~/assets/Logo/Logo.png';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  Logo,
  SignLink,
  SignLinkText,
} from './styles';
import Background from '~/components/Background';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordRef = useRef();

  return (
    <Background>
      <Container>
        <Logo source={logo} />

        <Form>
          <FormInput
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            secureTextEntry
            placeholder="Sua senha secreta"
            returnKeyType="send"
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
          />
          <SubmitButton>Entrar</SubmitButton>
        </Form>

        <SignLink onPress={() => navigation.navigate('SignUp')}>
          <SignLinkText>Criar conta grátis</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
