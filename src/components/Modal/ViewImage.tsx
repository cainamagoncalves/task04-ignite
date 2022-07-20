import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  Flex,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <Image src={imgUrl} mw="900px" mh="600px"  />
        <ModalFooter justifyContent="flex-start" mw="900px" mh="32px" background="pGray.800" top="600px">
          <Link href={imgUrl} target="_blank" lineHeight="16.41px" color="pGray.50" fontSize="14px">Abrir original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
