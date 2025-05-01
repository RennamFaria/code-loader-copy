import React, {useContext, useState, useRef} from 'react';
import {
  Text,
  Box,
  Avatar,
  HStack,
  VStack,
  Flex,
  Button,
  Input,
  SkeletonCircle,
} from '@chakra-ui/react';
import {IoMdDownload} from 'react-icons/io';
import {get} from 'lodash';
import {toast} from 'react-toastify';

import {Context as AuthContext} from '../../stores/Auth';

const AvatarSelector = ({sendDataToParent, onClose}) => {
  const {user} = useContext(AuthContext);
  const [avatarData, setAvatarData] = useState({
    name: get(user, 'name', ''),
    image: get(user, 'avatar', ''),
  });
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [isPresetAvatarLoading, setIsPresetAvatarLoading] = useState(
    Object.fromEntries(presetAvatars.map((_, i) => [i, true])),
  );

  const fileInputRef = useRef(null);

  toast.configure();

  const presetAvatarsElement = presetAvatars.map((presetAvatar, index) => (
    <Box>
      {isPresetAvatarLoading[index] && (
        <SkeletonCircle size="24" position="absolute" />
      )}
      <Avatar
        key={index}
        onClick={() => handleClickAvatar(index)}
        size="xl"
        src={presetAvatar}
        onLoad={() => handlePresetAvatarLoad(index)}
        opacity={isPresetAvatarLoading[index] ? 0 : 1}
        _hover={{
          cursor: 'pointer',
          transform: 'scale(1.1)',
          transition: 'all 0.2s ease',
        }}
      />
    </Box>
  ));

  const handlePresetAvatarLoad = (index) => {
    setIsPresetAvatarLoading((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const handleClickAvatar = (index) => {
    addAvatar(presetAvatars[index]);
  };

  const handleClickChangeAvatar = () => {
    fileInputRef.current.click();
  };

  const handleFileChangeAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.match('image.*')) {
        const imageUrl = URL.createObjectURL(file);
        addAvatar(imageUrl);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  // Adiciona imagem no portrait e prepara para enviar
  const addAvatar = (image) => {
    const previousImage = avatarData.image;

    try {
      setIsAvatarLoading(true);
      setAvatarData((prevData) => ({
        ...prevData,
        image,
      }));
    } catch (error) {
      toast.error('Error ao adionar avatar no icone:', error);
      // Rollback
      setAvatarData((prevData) => ({
        ...prevData,
        image: previousImage,
      }));
    } finally {
      setIsAvatarLoading(false);
    }
  };

  const uploadingAvatar = () => {
    try {
      const response = sendDataToParent(avatarData);
      if (!response.ok) {
        alert('Ocorre um erro ao enviar imagem!');
        console.error(`Error: ${response}`);
      }
    } catch (error) {
      console.error('Erro interno! Falha ao enviar imagem para sistema', error);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      const hasImageChanged = avatarData?.image !== get(user, 'avatar', '');

      if (!hasImageChanged) {
        toast.warning('Nenhuma alteração detectada.');
        return;
      }

      uploadingAvatar();
      onClose();
    } catch (error) {
      toast.error('Não foi possível salvar as alterações.');
      console.error('Erro ao salvar avatar:', error);
    }
  };

  return (
    <>
      <VStack spacing={6} align="stretch">
        <Box>
          <HStack spacing={8} py={2} align="center">
            {isAvatarLoading ? (
              <SkeletonCircle size="24" />
            ) : (
              <Avatar
                key={user.id}
                size="xl"
                name={avatarData.name}
                src={avatarData.image}
              />
            )}
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChangeAvatar}
              accept="image/*"
              display="none"
            />
            <Button
              leftIcon={<IoMdDownload size="20px" />}
              w="225px"
              h="45px"
              colorScheme="blackAlpha"
              onClick={() => handleClickChangeAvatar()}>
              Carregar imagem
            </Button>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight={500}>Avatares padrão</Text>
          <Flex minChildWidth="100px" flexWrap="wrap" gap={6} py={2}>
            {presetAvatarsElement}
          </Flex>
        </Box>

        <Box>
          <Button
            disabled={isAvatarLoading}
            colorScheme="primary"
            type="submit"
            onClick={handleSaveAvatar}
            isLoading={isAvatarLoading}>
            Ok
          </Button>
        </Box>
      </VStack>
    </>
  );
};

// Placeholder avatars
const presetAvatars = [
  'https://avatar.iran.liara.run/public/46',
  'https://avatar.iran.liara.run/public/90',
  'https://avatar.iran.liara.run/public/22',
  'https://avatar.iran.liara.run/public/57',
  'https://avatar.iran.liara.run/public/14',
  'https://avatar.iran.liara.run/public/79',
  'https://avatar.iran.liara.run/public/18',
  'https://avatar.iran.liara.run/public/100',
];

export default AvatarSelector;
