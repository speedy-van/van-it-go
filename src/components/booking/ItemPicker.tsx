'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Badge,
  Button,
  HStack,
  VStack,
  Text,
  Wrap,
  WrapItem,
  Collapse,
  IconButton,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import type { RemovalItem, RemovalCategory, SelectedRemovalItem } from '@/lib/removal-items';

interface ItemPickerProps {
  itemsData: { categories: RemovalCategory[] } | null;
  selected: SelectedRemovalItem[];
  onSelectionChange: (selected: SelectedRemovalItem[]) => void;
  isLoading?: boolean;
}

function ItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
  disabled,
}: {
  item: RemovalItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Box
      p={3}
      borderRadius="lg"
      bg="#0F0F2A"
      border="1px solid"
      borderColor="whiteAlpha.200"
      _hover={{ borderColor: 'whiteAlpha.300' }}
      transition="border-color 0.2s"
    >
      <Box
        w="full"
        h="80px"
        bg="whiteAlpha.100"
        borderRadius="md"
        mb={2}
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {item.imageUrl && !imgError ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            maxH="80px"
            objectFit="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <Text fontSize="2xl" opacity={0.5}>
            📦
          </Text>
        )}
      </Box>
      <Text fontSize="sm" fontWeight="medium" noOfLines={2} mb={1}>
        {item.name}
      </Text>
      <HStack fontSize="xs" color="whiteAlpha.600" mb={2} spacing={2}>
        <span>{item.weightKg}kg</span>
        <span>·</span>
        <span>{(item.volumeM3 * 1000).toFixed(0)}L</span>
      </HStack>
      <HStack spacing={1}>
        {quantity > 0 ? (
          <>
            <IconButton
              aria-label="Remove"
              size="xs"
              variant="ghost"
              onClick={onRemove}
              isDisabled={disabled}
            >
              −
            </IconButton>
            <Badge colorScheme="purple" px={2}>
              {quantity}
            </Badge>
            <IconButton
              aria-label="Add"
              size="xs"
              variant="ghost"
              onClick={onAdd}
              isDisabled={disabled}
            >
              +
            </IconButton>
          </>
        ) : (
          <Button size="xs" colorScheme="purple" onClick={onAdd} isDisabled={disabled}>
            Add
          </Button>
        )}
      </HStack>
    </Box>
  );
}

export function ItemPicker({
  itemsData,
  selected,
  onSelectionChange,
  isLoading = false,
}: ItemPickerProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const selectedMap = useMemo(() => {
    const m = new Map<string, number>();
    selected.forEach((s) => m.set(s.item.id, s.quantity));
    return m;
  }, [selected]);

  const categories = useMemo(
    () => itemsData?.categories ?? [],
    [itemsData?.categories]
  );

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.categoryDisplay.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, search]);

  const handleAdd = (item: RemovalItem) => {
    const existing = selected.find((s) => s.item.id === item.id);
    if (existing) {
      onSelectionChange(
        selected.map((s) =>
          s.item.id === item.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      );
    } else {
      onSelectionChange([...selected, { item, quantity: 1 }]);
    }
  };

  const handleRemove = (item: RemovalItem) => {
    const existing = selected.find((s) => s.item.id === item.id);
    if (!existing) return;
    if (existing.quantity <= 1) {
      onSelectionChange(selected.filter((s) => s.item.id !== item.id));
    } else {
      onSelectionChange(
        selected.map((s) =>
          s.item.id === item.id ? { ...s, quantity: s.quantity - 1 } : s
        )
      );
    }
  };

  const handleRemoveAll = (item: RemovalItem) => {
    onSelectionChange(selected.filter((s) => s.item.id !== item.id));
  };

  const totalVolume = useMemo(
    () => selected.reduce((s, x) => s + x.item.volumeM3 * x.quantity, 0),
    [selected]
  );
  const totalItems = useMemo(
    () => selected.reduce((s, x) => s + x.quantity, 0),
    [selected]
  );

  if (isLoading || !itemsData) {
    return (
      <Box p={6} textAlign="center" color="whiteAlpha.600">
        Loading item catalog…
      </Box>
    );
  }

  return (
    <VStack align="stretch" spacing={4}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">🔍</InputLeftElement>
        <Input
          placeholder="Search items or categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="#0F0F2A"
          borderColor="whiteAlpha.300"
        />
      </InputGroup>

      <Wrap spacing={2}>
        <WrapItem>
          <Button
            size="sm"
            variant={activeCategory === null ? 'solid' : 'outline'}
            colorScheme="purple"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
        </WrapItem>
        {categories.slice(0, 12).map((cat) => (
          <WrapItem key={cat.id}>
            <Button
              size="sm"
              variant={activeCategory === cat.id ? 'solid' : 'ghost'}
              colorScheme="purple"
              onClick={() =>
                setActiveCategory(activeCategory === cat.id ? null : cat.id)
              }
            >
              {cat.displayName}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      {selected.length > 0 && (
        <Box
          p={3}
          bg="purple.900"
          bgGradient="linear(to-r, purple.900, purple.800)"
          borderRadius="lg"
          border="1px solid"
          borderColor="purple.500"
        >
          <HStack justify="space-between" mb={2}>
            <Text fontWeight="bold" fontSize="sm">
              Selected: {totalItems} item{totalItems !== 1 ? 's' : ''} ·{' '}
              {totalVolume.toFixed(2)} m³
            </Text>
            <Button size="xs" variant="ghost" onClick={onToggle}>
              {isOpen ? 'Hide' : 'Show'}
            </Button>
          </HStack>
          <Collapse in={isOpen}>
            <Wrap spacing={2}>
              {selected.map((s) => (
                <WrapItem key={s.item.id}>
                  <Badge
                    colorScheme="purple"
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    {s.item.name} × {s.quantity}
                    <Button
                      size="xs"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      aria-label="Remove all"
                      onClick={() => handleRemoveAll(s.item)}
                    >
                      ×
                    </Button>
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </Collapse>
        </Box>
      )}

      <Box maxH="320px" overflowY="auto">
        {filteredCategories
          .filter((c) => !activeCategory || c.id === activeCategory)
          .map((cat) => (
            <Box key={cat.id} mb={6}>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="#FFB800"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {cat.displayName}
              </Text>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                {cat.items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    quantity={selectedMap.get(item.id) ?? 0}
                    onAdd={() => handleAdd(item)}
                    onRemove={() => handleRemove(item)}
                    disabled={isLoading}
                  />
                ))}
              </SimpleGrid>
            </Box>
          ))}
      </Box>

      {filteredCategories.length === 0 && (
        <Text color="whiteAlpha.600" textAlign="center" py={8}>
          No items match &quot;{search}&quot;
        </Text>
      )}
    </VStack>
  );
}
