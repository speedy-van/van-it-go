'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Select,
  Text,
  Slider,
  SliderTrack,
  SliderThumb,
  Divider,
  Image,
  Grid,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { ItemPicker } from './ItemPicker';
import type { BookingData, QuoteData } from './BookingWizard';
import type { RemovalItemsData, SelectedRemovalItem } from '@/lib/removal-items';

interface StepItemsProps {
  data: BookingData;
  onDataChange: (data: Partial<BookingData>) => void;
  onNext: () => void;
  isLoading: boolean;
}

function toStoredSelected(
  selected: SelectedRemovalItem[]
): BookingData['selectedItems'] {
  return selected.map((s) => ({
    itemId: s.item.id,
    itemName: s.item.name,
    quantity: s.quantity,
    volumeM3: s.item.volumeM3,
    weightKg: s.item.weightKg,
  }));
}

function fromStoredSelected(
  stored: BookingData['selectedItems'],
  itemsData: RemovalItemsData | null
): SelectedRemovalItem[] {
  if (!stored?.length || !itemsData) return [];
  const itemMap = new Map<string, SelectedRemovalItem['item']>();
  for (const cat of itemsData.categories) {
    for (const item of cat.items) {
      itemMap.set(item.id, item);
    }
  }
  return stored
    .map((s) => {
      const item = itemMap.get(s.itemId);
      if (!item) return null;
      return { item, quantity: s.quantity };
    })
    .filter((x): x is SelectedRemovalItem => x !== null);
}

export function StepItems({
  data,
  onDataChange,
  onNext,
  isLoading: initialLoading,
}: StepItemsProps) {
  const [itemsData, setItemsData] = useState<RemovalItemsData | null>(null);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [selected, setSelected] = useState<SelectedRemovalItem[]>([]);
  const [manualVolume, setManualVolume] = useState(data.volumeCubicMeters ?? 5);
  const [itemCount, setItemCount] = useState(data.itemCount || 1);
  const [serviceType, setServiceType] = useState(
    data.serviceType || 'house_move'
  );
  const [notes, setNotes] = useState(data.notes || '');
  const [photos, setPhotos] = useState<string[]>(data.photos || []);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/removal-items.json')
      .then((r) => r.json())
      .then((d) => {
        setItemsData(d);
        if (data.selectedItems?.length && d) {
          setSelected(fromStoredSelected(data.selectedItems, d));
        }
      })
      .catch(() => setItemsData(null))
      .finally(() => setItemsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore only on mount when items load
  }, []);

  const volumeFromItems = selected.reduce(
    (s, x) => s + x.item.volumeM3 * x.quantity,
    0
  );
  const itemCountFromSelection = selected.reduce((s, x) => s + x.quantity, 0);
  const useItemVolume = selected.length > 0 && volumeFromItems > 0;
  const volume = useItemVolume ? volumeFromItems : manualVolume;
  const effectiveItemCount = useItemVolume ? itemCountFromSelection : itemCount;

  const handleGetQuote = useCallback(async () => {
    if (
      !data.pickupLat ||
      !data.pickupLng ||
      !data.dropoffLat ||
      !data.dropoffLng
    ) {
      setError('Please complete address step first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pricing/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLat: data.pickupLat,
          pickupLng: data.pickupLng,
          dropoffLat: data.dropoffLat,
          dropoffLng: data.dropoffLng,
          volumeCubicMeters: volume,
          serviceType,
          itemCount: effectiveItemCount,
          pickupFloorNumber: data.pickupFloorNumber,
          pickupHasLift: data.pickupHasLift,
          dropoffFloorNumber: data.dropoffFloorNumber,
          dropoffHasLift: data.dropoffHasLift,
        }),
      });

      if (!response.ok) throw new Error('Quote failed');

      const result = await response.json();
      setQuote(result.quote);
    } catch (err) {
      setError('Failed to get quote. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    data.pickupLat,
    data.pickupLng,
    data.dropoffLat,
    data.dropoffLng,
    data.pickupFloorNumber,
    data.pickupHasLift,
    data.dropoffFloorNumber,
    data.dropoffHasLift,
    volume,
    serviceType,
    effectiveItemCount,
  ]);

  const handleContinue = () => {
    const hasCustomized = selected.some(
      (s) => (s.item.specialHandling || '').toLowerCase().includes('custom')
    );
    onDataChange({
      itemCount: effectiveItemCount,
      volumeCubicMeters: volume,
      serviceType,
      notes,
      photos,
      quotePrice: quote?.totalPrice,
      selectedItems: toStoredSelected(selected),
      hasCustomizedItems: hasCustomized,
    });
    onNext();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit to 5 photos max
    const newPhotos = Array.from(files).slice(0, 5 - photos.length);

    newPhotos.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotos((prev) => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontWeight="bold" mb={2}>
          Pick your items
        </Text>
        <Text fontSize="sm" color="whiteAlpha.700" mb={3}>
          Browse 398 UK removal items by category. Volume and quote update from your selection.
        </Text>
        <ItemPicker
          itemsData={itemsData}
          selected={selected}
          onSelectionChange={setSelected}
          isLoading={itemsLoading}
        />
      </Box>

      <Divider />

      <Box>
        <FormControl>
          <FormLabel htmlFor="volume">
            Estimated Volume: {volume.toFixed(1)} m³
            {useItemVolume && (
              <Text as="span" fontSize="xs" color="whiteAlpha.600" ml={2}>
                (from selection)
              </Text>
            )}
          </FormLabel>
          <Slider
            id="volume"
            min={0.5}
            max={50}
            step={0.5}
            value={useItemVolume ? volume : manualVolume}
            onChange={(v) => {
              setManualVolume(v);
              if (!useItemVolume) setItemCount(Math.max(1, Math.round(v)));
            }}
            isDisabled={isLoading || initialLoading}
          >
            <SliderTrack bg="#0F0F2A">
              <Box position="relative" right={0} height="100%">
                <SliderThumb
                  boxSize={5}
                  bg="#7B2FFF"
                  _hover={{ bg: '#FFB800' }}
                />
              </Box>
            </SliderTrack>
          </Slider>
          <Text fontSize="xs" color="#EBF1FF" mt={2}>
            {useItemVolume
              ? 'Adjust manually if needed; selection takes precedence.'
              : 'Average room 1–2 m³, furniture 0.5–3 m³ each'}
          </Text>
        </FormControl>
      </Box>

      {!useItemVolume && (
        <Box>
          <FormControl>
            <FormLabel htmlFor="items">Number of Items</FormLabel>
            <Input
              id="items"
              type="number"
              min={1}
              max={100}
              value={itemCount}
              onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
              isDisabled={isLoading || initialLoading}
            />
          </FormControl>
        </Box>
      )}

      <Box>
        <FormControl>
          <FormLabel htmlFor="service">Service Type</FormLabel>
          <Select
            id="service"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            isDisabled={isLoading || initialLoading}
          >
            <option value="house_move">House Move</option>
            <option value="office_move">Office Move</option>
            <option value="single_item">Single Item</option>
            <option value="student_move">Student Move</option>
            <option value="ebay_delivery">eBay/Marketplace Delivery</option>
          </Select>
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel htmlFor="notes">Additional Notes</FormLabel>
          <Textarea
            id="notes"
            placeholder="Any special requirements? (e.g., fragile items, stairs, parking...)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            isDisabled={isLoading || initialLoading}
            rows={4}
          />
        </FormControl>
      </Box>

      <Box>
        <FormControl>
          <FormLabel htmlFor="photos">
            📸 Upload Photos
            <Badge ml={2} colorScheme="purple">
              {photos.length}/5
            </Badge>
          </FormLabel>
          <Text fontSize="xs" color="#EBF1FF" mb={3}>
            Help us get a better estimate with photos of your items (optional, max 5)
          </Text>
          <Input
            id="photos"
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            isDisabled={isLoading || initialLoading || photos.length >= 5}
            display="none"
          />
          <Button
            as="label"
            htmlFor="photos"
            cursor="pointer"
            variant="outline"
            isDisabled={isLoading || initialLoading || photos.length >= 5}
            mb={4}
          >
            Choose Photos
          </Button>

          {photos.length > 0 && (
            <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={3} mt={4}>
              {photos.map((photo, index) => (
                <Box key={index} position="relative" borderRadius="8px" overflow="hidden">
                  <Image
                    src={photo}
                    alt={`Upload preview ${index + 1}`}
                    boxSize="100px"
                    objectFit="cover"
                  />
                  <IconButton
                    aria-label="Remove photo"
                    icon={<CloseIcon />}
                    size="sm"
                    position="absolute"
                    top={1}
                    right={1}
                    bg="rgba(0,0,0,0.6)"
                    color="white"
                    _hover={{ bg: 'rgba(0,0,0,0.8)' }}
                    onClick={() => removePhoto(index)}
                  />
                </Box>
              ))}
            </Grid>
          )}
        </FormControl>
      </Box>

      {error && (
        <Box p={4} bg="red" color="white" borderRadius="8px">
          {error}
        </Box>
      )}

      {quote && (
        <Box
          p={6}
          bg="#0F0F2A"
          borderRadius="10px"
          borderLeft="4px solid #7B2FFF"
        >
          <Text fontSize="sm" color="#EBF1FF" mb={4}>
            Distance: {quote.distanceKm}km | Duration: ~
            {quote.estimatedDuration}min
          </Text>
          <HStack spacing={4} mb={4}>
            <Box>
              <Text fontSize="xs" color="#EBF1FF">
                Base
              </Text>
              <Text fontWeight="bold">£{quote.basePrice}</Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="#EBF1FF">
                Distance
              </Text>
              <Text fontWeight="bold">
                £{quote.distancePrice.toFixed(2)}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color="#EBF1FF">
                Volume
              </Text>
              <Text fontWeight="bold">
                £{quote.volumePrice.toFixed(2)}
              </Text>
            </Box>
          </HStack>
          <Box
            p={3}
            bg="rgba(123, 47, 255, 0.2)"
            borderRadius="8px"
          >
            <Text fontSize="sm" color="#EBF1FF">
              Estimated Price
            </Text>
            <Text
              fontSize="24px"
              fontWeight="bold"
              color="#FFB800"
            >
              £{quote.totalPrice.toFixed(2)}
            </Text>
          </Box>
        </Box>
      )}

      <HStack spacing={4} justify="space-between" pt={4}>
        <Button
          variant="outline"
          onClick={handleGetQuote}
          isLoading={isLoading}
          isDisabled={initialLoading}
        >
          Get Quote
        </Button>
        <Button
          bg="#FFB800"
          color="#06061A"
          onClick={handleContinue}
          isDisabled={isLoading || initialLoading}
        >
          Continue
        </Button>
      </HStack>
    </VStack>
  );
}
