import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';

export default function Search({ search, searchClicked, handleSearch, searching, backSearchClicked }: { search: string, searchClicked: () => void, handleSearch: (text: string) => void, searching: boolean, backSearchClicked: () => void }) {

    return (
        <TouchableOpacity style={styles.searchContainer}  >
            {
                searching ?
                    <TouchableOpacity onPress={backSearchClicked} style={{ padding: 10, paddingLeft: 0 }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity> : null
            }

            <TextInput
                placeholder="Search User"
                value={search}
                onFocus={searchClicked}
                onChangeText={handleSearch}
                style={{
                    width: "100%",  // Full width
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    fontSize: 14,
                    backgroundColor: "#fff",
                }}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    searchContainer: { display: 'flex', flexDirection: 'row', backgroundColor: 'white', padding: 10 }
});
