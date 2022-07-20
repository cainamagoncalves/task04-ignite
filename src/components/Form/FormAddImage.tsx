import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface IFormInputProps {
  image: FileList;
  title: string;
  description: string;
  url: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

const regexToValidateImage = new RegExp(/\.(jpeg|jpg|png|gif)$/i);

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: "Imagem Obrigatória",
      validate: {
        lessThan10MB: (file: FileList) => file[0].size < (100 * 10 * 10 * 10) || "Arquivo deve ser menor que 10MB", // 10 MB
        acceptedFormats: (file: FileList) => regexToValidateImage.test(file[0].name) || "Somente são aceitos arquivos PNG, JPEG e GIF",
      }
    },
    title: {
      required: "Título obrigatório",
      minLength: { value: 2, message: "Mínimo 2 caracteres" },
      maxLength: { value: 20, message: "Máximo 20 caracteres" }
    },
    description: {
      required: "Descrição obrigatória",
      maxLength: { value: 65, message: "Máximo 20 caracteres" },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: IFormInputProps) => api.post("/api/images", payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("images");
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;


  const onSubmit = async (data: IFormInputProps): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          status: "error",
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          isClosable: true,
        });
        return
      }

      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync({
        ...data,
        url: imageUrl
      })
      // TODO SHOW SUCCESS TOAST
      toast({
        status: "success",
        title: "Imagem cadastrada",
        description: "Imagem cadastrada com sucesso."
      })
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        status: "error",
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem."
      })
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
      setImageUrl('');
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          {...register("image", formValidations.image)}
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
        // TODO SEND IMAGE ERRORS
        // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          {...register("title", formValidations.title)}
          placeholder="Título da imagem..."
          error={errors.title}
        // TODO SEND TITLE ERRORS
        // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          {...register("description", formValidations.description)}
          placeholder="Descrição da imagem..."
          error={errors.description}
        // TODO SEND DESCRIPTION ERRORS
        // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
