import { Box, Flex, HStack, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthRedirectHandler } from '@/api/hooks/useAuthRedirectHandler';
import { useGetDetailProduct } from '@/api/hooks/useGetDetailProduct';
import { CTAButton } from '@/components/common/Button/CTAButton';
import { Stepper } from '@/components/common/Stepper/stepper';
import { ProductDetailSection } from '@/components/features/ProductDetail/ProductDetailSection';
import { TotalPrice } from '@/components/features/ProductDetail/TotalPrice';
import { getDynamicPath } from '@/routes/path';

export const DetailGoodsItemPage = () => {
  const { productId = '0' } = useParams<{ productId: string }>();
  const { data, isLoading, isError } = useGetDetailProduct({ productId });
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const totalPrice = quantity * (data?.price.sellingPrice || 0);

  const handleAuthRedirect = useAuthRedirectHandler();

  const handleClick = () => {
    handleAuthRedirect({
      nextPageUrl: getDynamicPath.order(data?.id.toString() || '0'),
      state: {
        imageURL: data?.imageURL,
        name: data?.name,
        totalPrice,
        brandName: data?.brandInfo.name,
      },
    });
  };

  if (isError) return <div>Error occurred</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Flex minHeight="100vh" alignItems="top" justifyContent="center" padding="4">
      {data && (
        <HStack align="start">
          <Image src={data?.imageURL} alt="img" boxSize="450px" />

          <ProductDetailSection name={data?.name} sellingPrice={data?.price.sellingPrice} />

          <VStack>
            <Box width="318px" border="1px" borderColor="gray.200">
              <VStack py="12px" px="8px">
                <Text fontWeight="bold">{data?.name}</Text>

                <Stepper
                  value={quantity}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />
              </VStack>
            </Box>

            <TotalPrice totalPrice={totalPrice} />

            <Spacer />
            <CTAButton
              text="나에게 선물하기"
              textColor="white"
              background="black"
              onClick={handleClick}
            />
          </VStack>
        </HStack>
      )}
    </Flex>
  );
};