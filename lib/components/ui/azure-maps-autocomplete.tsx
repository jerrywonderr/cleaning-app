import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { locationService } from "../../services/locationService";
import { AddressSearchResult } from "../../types/location";
import { Text } from "./text";

interface AzureMapsAutocompleteProps {
  placeholder?: string;
  onSelect: (data: AddressSearchResult) => void;
  initialValue?: string;
  onTextChange?: (text: string) => void;
}

export const AzureMapsAutocomplete: React.FC<AzureMapsAutocompleteProps> = ({
  placeholder,
  onSelect,
  initialValue,
  onTextChange,
}) => {
  const [searchText, setSearchText] = useState(initialValue || "");
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSearchText(initialValue || "");
  }, [initialValue]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await locationService.searchAddress(query);
      // Type assertion since we know the service returns AddressSearchResult[]
      setResults(searchResults as AddressSearchResult[]);
    } catch (err) {
      setError("Failed to fetch results");
      console.error("Address search error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (searchText && searchText.length >= 3) {
        handleSearch(searchText);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchText, handleSearch]);

  const handleSelect = (item: AddressSearchResult) => {
    onSelect(item);
    setSearchText(item.address.freeformAddress);
    setResults([]);
  };

  return (
    <View className="flex-1">
      <View className="relative mb-2">
        <TextInput
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onTextChange?.(text);
          }}
          placeholder={placeholder || "Enter your address"}
          className="h-[56px] rounded-xl px-4 border border-gray-200 text-base bg-white"
          placeholderTextColor="#676767"
        />
        {isLoading && (
          <View className="absolute right-4 top-4">
            <ActivityIndicator size="small" color="#3b82f6" />
          </View>
        )}
      </View>

      {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

      {results.length > 0 && (
        <View className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <FlashList
            showsVerticalScrollIndicator={false}
            data={results}
            keyExtractor={(_, index) => index.toString()}
            estimatedItemSize={80}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="p-4 border-b border-gray-100"
              >
                <Text className="text-base">
                  {item.address.freeformAddress}
                </Text>
                <Text className="text-sm text-gray-500">
                  {item.address.country}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
