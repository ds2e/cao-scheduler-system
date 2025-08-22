<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    private $defaultItems = [
        // SALATE
        [
            "id" => 1,
            "code" => "1",
            "name" => "Konfetti (nur Grünzeug)",
            "sub_category_id" => 1,
            "price" => 6.5
        ],
        [
            "id" => 2,
            "code" => "2",
            "name" => "Konfetti (Bio Tofu)",
            "sub_category_id" => 1,
            "price" => 7.5
        ],
        [
            "id" => 3,
            "code" => "3",
            "name" => "Konfetti (gegrilltes Hähnchen)",
            "sub_category_id" => 1,
            "price" => 9.5
        ],
        [
            "id" => 4,
            "code" => "4",
            "name" => "Konfetti (Lachs)",
            "sub_category_id" => 1,
            "price" => 15
        ],
        [
            "id" => 6,
            "code" => "5",
            "name" => "Der Gewickelte (Bio Tofu)",
            "sub_category_id" => 1,
            "price" => 6.5
        ],
        [
            "id" => 7,
            "code" => "6",
            "name" => "Der Gewickelte (Hähnchenbrust)",
            "sub_category_id" => 1,
            "price" => 6.5
        ],
        [
            "id" => 8,
            "code" => "7",
            "name" => "Der Gewickelte (Garnelen)",
            "sub_category_id" => 1,
            "price" => 6.5
        ],
        [
            "id" => 9,
            "code" => "8",
            "name" => "Der Gewickelte (Wakame)",
            "sub_category_id" => 1,
            "price" => 7
        ],
        // Süppchen
        [
            "id" => 10,
            "code" => "11",
            "name" => "Miso",
            "sub_category_id" => 2,
            "price" => 6
        ],
        [
            "id" => 11,
            "code" => "12",
            "name" => "Sauer - Scharf",
            "sub_category_id" => 2,
            "price" => 6.5
        ],
        [
            "id" => 12,
            "code" => "13",
            "name" => "Teigtasche Suppe (Gemüse | Vegan)",
            "sub_category_id" => 2,
            "price" => 6.5
        ],
        [
            "id" => 13,
            "code" => "14",
            "name" => "Teigtasche Suppe (Hähnchen)",
            "sub_category_id" => 2,
            "price" => 6.5
        ],
        [
            "id" => 14,
            "code" => "15",
            "name" => "Teigtasche Suppe (Garnelen)",
            "sub_category_id" => 2,
            "price" => 6.5
        ],
        // TAPAS
        [
            "id" => 15,
            "code" => "20",
            "name" => "Gemüse Stick",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 16,
            "code" => "21",
            "name" => "Cha Gio Chay",
            "sub_category_id" => 3,
            "price" => 6
        ],
        [
            "id" => 17,
            "code" => "22",
            "name" => "Dreiecken",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 18,
            "code" => "23",
            "name" => "vegane Teigtaschen",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 19,
            "code" => "24",
            "name" => "Hähnchen Teigtaschen",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 20,
            "code" => "25",
            "name" => "Garnelen Teigtaschen",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 21,
            "code" => "26",
            "name" => "Ebi Fry",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 22,
            "code" => "27",
            "name" => "Cha Gio",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 23,
            "code" => "28",
            "name" => "Money Bags",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 24,
            "code" => "29",
            "name" => "Spiessee",
            "sub_category_id" => 3,
            "price" => 6.5
        ],
        [
            "id" => 25,
            "code" => "30",
            "name" => "Erdapffel",
            "sub_category_id" => 3,
            "price" => 8
        ],
        // BAO BUNS
        [
            "id" => 26,
            "code" => "31",
            "name" => "Vegan Cáo",
            "sub_category_id" => 4,
            "price" => 15
        ],
        [
            "id" => 27,
            "code" => "32",
            "name" => "Cheeky Buns",
            "sub_category_id" => 4,
            "price" => 17
        ],
        [
            "id" => 28,
            "code" => "33",
            "name" => "Nice To Meat You",
            "sub_category_id" => 4,
            "price" => 19
        ],
        [
            "id" => 29,
            "code" => "34",
            "name" => "Shrimply Tempura",
            "sub_category_id" => 4,
            "price" => 17
        ],
        [
            "id" => 30,
            "code" => "35",
            "name" => "Fish Lover",
            "sub_category_id" => 4,
            "price" => 16
        ],
        // REIS - NUDELN
        [
            "id" => 31,
            "code" => "40",
            "name" => "Curry (Bio Tofu | Vegan)",
            "sub_category_id" => 5,
            "price" => 15
        ],
        [
            "id" => 32,
            "code" => "41",
            "name" => "Curry (Hähnchen)",
            "sub_category_id" => 5,
            "price" => 16
        ],
        [
            "id" => 33,
            "code" => "42",
            "name" => "Canh Chua (Lachs)",
            "sub_category_id" => 5,
            "price" => 22
        ],
        [
            "id" => 34,
            "code" => "43",
            "name" => "Canh Chua (Garnelen in weizen Teigmantel)",
            "sub_category_id" => 5,
            "price" => 17
        ],
        [
            "id" => 35,
            "code" => "44",
            "name" => "Nudelsalat - Lauwarm (Bio Tofu)",
            "sub_category_id" => 5,
            "price" => 15
        ],
        [
            "id" => 36,
            "code" => "45",
            "name" => "gegrilltes Hähnchen",
            "sub_category_id" => 5,
            "price" => 17
        ],
        [
            "id" => 37,
            "code" => "46",
            "name" => "Bun Nem (Gemüse | Vegan | Glutenhaltig)",
            "sub_category_id" => 5,
            "price" => 15
        ],
        [
            "id" => 38,
            "code" => "47",
            "name" => "Bun Nem (Schweinefleisch - Gemüse)",
            "sub_category_id" => 5,
            "price" => 18
        ],
        [
            "id" => 39,
            "code" => "48",
            "name" => "Yaki Udon",
            "sub_category_id" => 5,
            "price" => 17
        ],
        [
            "id" => 40,
            "code" => "49",
            "name" => "Bun Cha",
            "sub_category_id" => 5,
            "price" => 19
        ],
        // SUPPEN
        [
            "id" => 41,
            "code" => "50",
            "name" => "Bun Tom Yum (Bio Tofu)",
            "sub_category_id" => 6,
            "price" => 15
        ],
        [
            "id" => 42,
            "code" => "51",
            "name" => "Bun Tom Yum (mit Garnelen)",
            "sub_category_id" => 6,
            "price" => 17
        ],
        [
            "id" => 43,
            "code" => "52",
            "name" => "Coco Easy (Bio Tofu | Vegan)",
            "sub_category_id" => 6,
            "price" => 15
        ],
        [
            "id" => 44,
            "code" => "53",
            "name" => "Coco Easy (Hähnchen)",
            "sub_category_id" => 6,
            "price" => 16
        ],
        [
            "id" => 45,
            "code" => "54",
            "name" => "Coco Easy (Garnelen)",
            "sub_category_id" => 6,
            "price" => 17
        ],
        [
            "id" => 46,
            "code" => "55",
            "name" => "Ramen (mariniertes Schweinefleisch)",
            "sub_category_id" => 6,
            "price" => 18
        ],
        [
            "id" => 47,
            "code" => "56",
            "name" => "Ramen (mariniertes Schweinefleisch)",
            "sub_category_id" => 6,
            "price" => 22
        ],
        [
            "id" => 49,
            "code" => "57",
            "name" => "Phö (Bio Tofu | Gemüse | Vegan)",
            "sub_category_id" => 6,
            "price" => 16
        ],
        [
            "id" => 51,
            "code" => "58",
            "name" => "Phö (Hähnchen)",
            "sub_category_id" => 6,
            "price" => 16
        ],
        [
            "id" => 52,
            "code" => "59",
            "name" => "Phö (Rindfleisch)",
            "sub_category_id" => 6,
            "price" => 18
        ],
        // SÜSSES
        [
            "id" => 53,
            "code" => "61",
            "name" => "Die Leberwurst (Vegan)",
            "sub_category_id" => 9,
            "price" => 6.5
        ],
        [
            "id" => 54,
            "code" => "62",
            "name" => "Reimaco (Vegan)",
            "sub_category_id" => 9,
            "price" => 7
        ],
        [
            "id" => 55,
            "code" => "63",
            "name" => "Green Soul",
            "sub_category_id" => 9,
            "price" => 7
        ],
        [
            "id" => 57,
            "code" => "64",
            "name" => "Tropi-Call (Vegan)",
            "sub_category_id" => 9,
            "price" => 6.5
        ],
        // GETRÄNKE
        // WASSER
        [
            "id" => 59,
            "code" => "-",
            "name" => "Wasser (0.25l)",
            "sub_category_id" => 12,
            "price" => 3
        ],
        [
            "id" => 61,
            "code" => "-",
            "name" => "Wasser (0.75l)",
            "sub_category_id" => 12,
            "price" => 7
        ],
        // HAUSGEMACHT
        // LIMO
        [
            "id" => 63,
            "code" => "-",
            "name" => "Gurke-Basilikum",
            "sub_category_id" => 13,
            "price" => 6
        ],
        [
            "id" => 64,
            "code" => "-",
            "name" => "Hibiskus",
            "sub_category_id" => 13,
            "price" => 6
        ],
        [
            "id" => 65,
            "code" => "-",
            "name" => "Minze - Limetten",
            "sub_category_id" => 13,
            "price" => 6
        ],
        [
            "id" => 66,
            "code" => "-",
            "name" => "Safran - Mango - Chili",
            "sub_category_id" => 13,
            "price" => 6
        ],
        [
            "id" => 67,
            "code" => "-",
            "name" => "Zitronengras - Ingwer",
            "sub_category_id" => 13,
            "price" => 6
        ],
        // EISTEE
        [
            "id" => 68,
            "code" => "-",
            "name" => "Granatapfel",
            "sub_category_id" => 8,
            "price" => 6
        ],
        [
            "id" => 70,
            "code" => "-",
            "name" => "Himbeere",
            "sub_category_id" => 8,
            "price" => 6
        ],
        [
            "id" => 71,
            "code" => "-",
            "name" => "Holunder",
            "sub_category_id" => 8,
            "price" => 6
        ],
        [
            "id" => 72,
            "code" => "-",
            "name" => "Litchi",
            "sub_category_id" => 8,
            "price" => 6
        ],
        [
            "id" => 73,
            "code" => "-",
            "name" => "Mango",
            "sub_category_id" => 8,
            "price" => 6
        ],
        [
            "id" => 74,
            "code" => "-",
            "name" => "Pfirsich",
            "sub_category_id" => 8,
            "price" => 6
        ],
        // SOFTDRINK
        [
            "id" => 75,
            "code" => "-",
            "name" => "Pepsi / Pepsi Zero",
            "sub_category_id" => 14,
            "price" => 3
        ],
        [
            "id" => 76,
            "code" => "-",
            "name" => "7Up",
            "sub_category_id" => 14,
            "price" => 3
        ],
        [
            "id" => 77,
            "code" => "-",
            "name" => "Orange Schwip Schwap",
            "sub_category_id" => 14,
            "price" => 3
        ],
        [
            "id" => 78,
            "code" => "-",
            "name" => "Bitter Lemon",
            "sub_category_id" => 14,
            "price" => 3
        ],
        [
            "id" => 79,
            "code" => "-",
            "name" => "Ginger Ale",
            "sub_category_id" => 14,
            "price" => 3
        ],
        [
            "id" => 80,
            "code" => "-",
            "name" => "Spicy Ginger",
            "sub_category_id" => 14,
            "price" => 3
        ],
        [
            "id" => 94,
            "code" => "-",
            "name" => "Tonic Water",
            "sub_category_id" => 14,
            "price" => 3
        ],
        // MOCK TAILS
        [
            "id" => 95,
            "code" => "-",
            "name" => "Cori's F.S.C",
            "sub_category_id" => 15,
            "price" => 7.5
        ],
        [
            "id" => 96,
            "code" => "-",
            "name" => "Lindas Unschuld",
            "sub_category_id" => 15,
            "price" => 7.5
        ],
        [
            "id" => 97,
            "code" => "-",
            "name" => "Mingwar",
            "sub_category_id" => 15,
            "price" => 7.5
        ],
        [
            "id" => 98,
            "code" => "-",
            "name" => "Thyme On Ice",
            "sub_category_id" => 15,
            "price" => 7.5
        ],
        [
            "id" => 99,
            "code" => "-",
            "name" => "Tweetea",
            "sub_category_id" => 15,
            "price" => 7.5
        ],
        // SÄFTE
        [
            "id" => 100,
            "code" => "-",
            "name" => "Ananassaft",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 101,
            "code" => "-",
            "name" => "Apfelsaft-Naturtrüb",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 102,
            "code" => "-",
            "name" => "Bananen Nektar",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 103,
            "code" => "-",
            "name" => "Cranberry Nektar",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 104,
            "code" => "-",
            "name" => "Grapefruitsaft",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 105,
            "code" => "-",
            "name" => "Mango Nektar",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 106,
            "code" => "-",
            "name" => "Maracuja Nektar",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 107,
            "code" => "-",
            "name" => "Orangensaft",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 108,
            "code" => "-",
            "name" => "Sauerkirsch Nektar",
            "sub_category_id" => 16,
            "price" => 3
        ],
        [
            "id" => 109,
            "code" => "-",
            "name" => "Kiba",
            "sub_category_id" => 16,
            "price" => 5.5
        ],
        // HEIße GETRÄNKE
        // KAFFEE
        [
            "id" => 110,
            "code" => "-",
            "name" => "Vietnamesischer Filterkaffee (ohne Kondensmilch)",
            "sub_category_id" => 17,
            "price" => 4.5
        ],
        [
            "id" => 111,
            "code" => "-",
            "name" => "Vietnamesischer Filterkaffee (mit Kondensmilch)",
            "sub_category_id" => 17,
            "price" => 5.5
        ],
        [
            "id" => 112,
            "code" => "-",
            "name" => "Ca Phe Muoi",
            "sub_category_id" => 17,
            "price" => 6.5
        ],
        // TEE
        [
            "id" => 113,
            "code" => "-",
            "name" => "Grüner Tee (normal)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 114,
            "code" => "-",
            "name" => "Grüner Tee (Jasmin)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 115,
            "code" => "-",
            "name" => "Grüner Tee (Apfel-Cocos)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 116,
            "code" => "-",
            "name" => "Grüner Tee (Orange-Zimt)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 117,
            "code" => "-",
            "name" => "Grüner Tee (gerösteter Reis)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 118,
            "code" => "-",
            "name" => "Schwazer Tee (normal)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 119,
            "code" => "-",
            "name" => "Schwazer Tee (normal)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 120,
            "code" => "-",
            "name" => "Schwazer Tee (Rose)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        [
            "id" => 122,
            "code" => "-",
            "name" => "Schwazer Tee (Minze)",
            "sub_category_id" => 18,
            "price" => 5
        ],
        // AUF GÜSSE
        [
            "id" => 123,
            "code" => "-",
            "name" => "Ingwer-Limette-Minze",
            "sub_category_id" => 19,
            "price" => 5
        ],
        [
            "id" => 124,
            "code" => "-",
            "name" => "Minze",
            "sub_category_id" => 19,
            "price" => 5
        ],
        [
            "id" => 125,
            "code" => "-",
            "name" => "Salbei-Orange",
            "sub_category_id" => 19,
            "price" => 5
        ],
        [
            "id" => 126,
            "code" => "-",
            "name" => "Zitronengras-Limette",
            "sub_category_id" => 19,
            "price" => 5
        ],
        [
            "id" => 127,
            "code" => "-",
            "name" => "Yuzu",
            "sub_category_id" => 19,
            "price" => 5
        ],
        // BIERE
        [
            "id" => 128,
            "code" => "-",
            "name" => "Allgäuer Büble (helles)",
            "sub_category_id" => 20,
            "price" => 5
        ],
        [
            "id" => 129,
            "code" => "-",
            "name" => "Allgäuer Büble (weizen)",
            "sub_category_id" => 20,
            "price" => 5
        ],
        [
            "id" => 130,
            "code" => "-",
            "name" => "Ritterguts Gose (ohne Sirup)",
            "sub_category_id" => 20,
            "price" => 5
        ],
        [
            "id" => 131,
            "code" => "-",
            "name" => "Ritterguts Gose (mit Sirup)",
            "sub_category_id" => 20,
            "price" => 6
        ],
        [
            "id" => 134,
            "code" => "-",
            "name" => "Staropramen (Lager)",
            "sub_category_id" => 20,
            "price" => 4
        ],
        [
            "id" => 135,
            "code" => "-",
            "name" => "Staropramen (Dark)",
            "sub_category_id" => 20,
            "price" => 5
        ],
        [
            "id" => 136,
            "code" => "-",
            "name" => "Allgäuer Büble (weizen | Alkoholfrei)",
            "sub_category_id" => 20,
            "price" => 5
        ],
        [
            "id" => 137,
            "code" => "-",
            "name" => "Jever Fun (Alkoholfrei)",
            "sub_category_id" => 20,
            "price" => 4
        ],
        // WEIN
        [
            "id" => 138,
            "code" => "-",
            "name" => "Rivaner-Grauer Burgunder",
            "sub_category_id" => 21,
            "price" => 7
        ],
        [
            "id" => 139,
            "code" => "-",
            "name" => "Riesling",
            "sub_category_id" => 21,
            "price" => 7
        ],
        [
            "id" => 140,
            "code" => "-",
            "name" => "Oppenheimer Krötenbrunnen",
            "sub_category_id" => 21,
            "price" => 7
        ],
        [
            "id" => 141,
            "code" => "-",
            "name" => "Spätburgunder",
            "sub_category_id" => 21,
            "price" => 7
        ],
        [
            "id" => 142,
            "code" => "-",
            "name" => "Rose D'Anjou",
            "sub_category_id" => 21,
            "price" => 7
        ],
        // PROSECCO
        [
            "id" => 143,
            "code" => "-",
            "name" => "Valdobbiadene",
            "sub_category_id" => 22,
            "price" => 6
        ],
        // SONSTIGES 
        // (SNACK / BEILAGE)
        [
            "id" => 145,
            "code" => "-",
            "name" => "Bar-Snacks",
            "sub_category_id" => 23,
            "price" => 7
        ],
        // COCKTAILS
        // FLIGHT SET
        [
            "id" => 146,
            "code" => "A",
            "name" => "Set A",
            "sub_category_id" => 25,
            "price" => 15
        ],
        [
            "id" => 147,
            "code" => "B",
            "name" => "Set B",
            "sub_category_id" => 25,
            "price" => 15
        ],
        [
            "id" => 148,
            "code" => "AB",
            "name" => "Set AB",
            "sub_category_id" => 25,
            "price" => 15
        ],
        [
            "id" => 149,
            "code" => "0",
            "name" => "Set 0",
            "sub_category_id" => 25,
            "price" => 15
        ],
        // SPRITZ/SPIZZ
        [
            "id" => 150,
            "code" => "Aperol",
            "name" => "Spritz",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 152,
            "code" => "Campari",
            "name" => "Amalfi",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 153,
            "code" => "Campari",
            "name" => "Spritz",
            "sub_category_id" => 26,
            "price" => 9.5
        ],
        [
            "id" => 154,
            "code" => "Crondino",
            "name" => "Spritz",
            "sub_category_id" => 26,
            "price" => 7.5
        ],
        [
            "id" => 155,
            "code" => "Limoncello",
            "name" => "Basillino",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 156,
            "code" => "Limoncello",
            "name" => "Spritz",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 157,
            "code" => "Limoncello",
            "name" => "Tonic",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 158,
            "code" => "Pampelle",
            "name" => "Rose",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 159,
            "code" => "Pampelle",
            "name" => "Spritz",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 160,
            "code" => "Pampelle",
            "name" => "Tonic",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 161,
            "code" => "Solrosa",
            "name" => "Spritz",
            "sub_category_id" => 26,
            "price" => 9
        ],
        [
            "id" => 162,
            "code" => "Solrosa",
            "name" => "Tonic",
            "sub_category_id" => 26,
            "price" => 9
        ],
        // NEGRONI
        [
            "id" => 163,
            "code" => "-",
            "name" => "Der Grossvater",
            "sub_category_id" => 27,
            "price" => 12
        ],
        [
            "id" => 164,
            "code" => "-",
            "name" => "Der Klassiker",
            "sub_category_id" => 27,
            "price" => 10
        ],
        [
            "id" => 165,
            "code" => "-",
            "name" => "Der Mexikaner",
            "sub_category_id" => 27,
            "price" => 11
        ],
        [
            "id" => 167,
            "code" => "-",
            "name" => "Der Sanfte",
            "sub_category_id" => 27,
            "price" => 10
        ],
        [
            "id" => 168,
            "code" => "-",
            "name" => "Der Schokoladen Twist",
            "sub_category_id" => 27,
            "price" => 11
        ],
        [
            "id" => 169,
            "code" => "-",
            "name" => "Der Seltsame",
            "sub_category_id" => 27,
            "price" => 12
        ],
        [
            "id" => 170,
            "code" => "-",
            "name" => "Der Spritzige",
            "sub_category_id" => 27,
            "price" => 11
        ],
        [
            "id" => 171,
            "code" => "-",
            "name" => "Der Würzige",
            "sub_category_id" => 27,
            "price" => 11
        ],
        // ALTE UND NEUE KLASSIKER
        [
            "id" => 172,
            "code" => "-",
            "name" => "Alt Modisch",
            "sub_category_id" => 28,
            "price" => 12
        ],
        [
            "id" => 173,
            "code" => "-",
            "name" => "ErwachsenenFilm-Darsteller Martini",
            "sub_category_id" => 28,
            "price" => 12
        ],
        [
            "id" => 174,
            "code" => "-",
            "name" => "Gänseblümchen",
            "sub_category_id" => 28,
            "price" => 12
        ],
        [
            "id" => 176,
            "code" => "-",
            "name" => "Wachmacher Martini",
            "sub_category_id" => 28,
            "price" => 12
        ],
        [
            "id" => 178,
            "code" => "-",
            "name" => "Saures Wasser Des Lebens",
            "sub_category_id" => 28,
            "price" => 12
        ],
        [
            "id" => 179,
            "code" => "-",
            "name" => "Schmerztöter",
            "sub_category_id" => 28,
            "price" => 12
        ],
        // SIGNATURE
        [
            "id" => 180,
            "code" => "-",
            "name" => "A Bitter Longing",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 181,
            "code" => "-",
            "name" => "Basis Bitch",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 182,
            "code" => "-",
            "name" => "Beischlaf am Strand",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 184,
            "code" => "-",
            "name" => "Bitter Boris",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 185,
            "code" => "-",
            "name" => "Bose Winter Traum",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 186,
            "code" => "-",
            "name" => "Breakfast Gang",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 187,
            "code" => "-",
            "name" => "Briegelinho",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 188,
            "code" => "-",
            "name" => "Bürohengst",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 189,
            "code" => "-",
            "name" => "Cocoyashi Village",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 190,
            "code" => "-",
            "name" => "Cold Hand Warm Heart",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 191,
            "code" => "-",
            "name" => "Danger Kitty",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 192,
            "code" => "-",
            "name" => "Das Versprechen",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 193,
            "code" => "-",
            "name" => "Der C.T.",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 196,
            "code" => "-",
            "name" => "Der Gelbe Bikini",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 197,
            "code" => "-",
            "name" => "Die E-Feee",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 198,
            "code" => "-",
            "name" => "Disorder",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 199,
            "code" => "-",
            "name" => "Domino",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 200,
            "code" => "-",
            "name" => "Donauwelle",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 201,
            "code" => "-",
            "name" => "Dr. Wolle's Hustensaft",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 202,
            "code" => "-",
            "name" => "Dừa",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 274,
            "code" => "-",
            "name" => "Duftmarke",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 275,
            "code" => "-",
            "name" => "Dugong",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 276,
            "code" => "-",
            "name" => "Einhornblut",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 277,
            "code" => "-",
            "name" => "Electric Lilac",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 278,
            "code" => "-",
            "name" => "Feierabend Fanta",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 279,
            "code" => "-",
            "name" => "Fette Elfe",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 280,
            "code" => "-",
            "name" => "Garfield hates Mondays",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 281,
            "code" => "-",
            "name" => "Glitzil - Litzil",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 282,
            "code" => "-",
            "name" => "Grün ist meine Lieblingsfarbe",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 283,
            "code" => "-",
            "name" => "Gurkensalat",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 284,
            "code" => "-",
            "name" => "Gute Aussicht",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 285,
            "code" => "-",
            "name" => "Herrgottbescheisserle",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 286,
            "code" => "-",
            "name" => "Hubba Bubba",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 287,
            "code" => "-",
            "name" => "Iris lässt dich bluten",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 288,
            "code" => "-",
            "name" => "Isaac",
            "sub_category_id" => 29,
            "price" => 13
        ],
        [
            "id" => 289,
            "code" => "-",
            "name" => "K.T.N.",
            "sub_category_id" => 29,
            "price" => 15
        ],
        [
            "id" => 290,
            "code" => "-",
            "name" => "Kanginsky",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 291,
            "code" => "-",
            "name" => "Kräuter Thomas",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 292,
            "code" => "-",
            "name" => "Läster Schwester",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 293,
            "code" => "-",
            "name" => "Lindas Einstieg",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 294,
            "code" => "-",
            "name" => "Lindas Melone",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 295,
            "code" => "-",
            "name" => "Lindas Untergang",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 296,
            "code" => "-",
            "name" => "Litch mir einen Punkt",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 297,
            "code" => "-",
            "name" => "Lotterleben",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 298,
            "code" => "-",
            "name" => "Milchreis",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 299,
            "code" => "-",
            "name" => "Milenka",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 300,
            "code" => "-",
            "name" => "Moody Morals",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 301,
            "code" => "-",
            "name" => "Muh Porn",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 302,
            "code" => "-",
            "name" => "Nee, Mach mal ohne Creme, sonst kotz ich",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 303,
            "code" => "-",
            "name" => "Nika Dynamite",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 304,
            "code" => "-",
            "name" => "Paradies of broken Dreams",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 305,
            "code" => "-",
            "name" => "Perfect Angel",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 306,
            "code" => "-",
            "name" => "Pilzrisotto",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 307,
            "code" => "-",
            "name" => "Ponyo",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 308,
            "code" => "-",
            "name" => "Q, weil es noch fehlte",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 309,
            "code" => "-",
            "name" => "Rosee Pamplemousse",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 310,
            "code" => "-",
            "name" => "Schoko Katze",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 311,
            "code" => "-",
            "name" => "Shiso Smash",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 312,
            "code" => "-",
            "name" => "Spanish Rose",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 313,
            "code" => "-",
            "name" => "Sparky on the Beach",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 314,
            "code" => "-",
            "name" => "Soft Cake",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 315,
            "code" => "-",
            "name" => "The Smile of Josephine",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 203,
            "code" => "-",
            "name" => "Tiramisu",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 316,
            "code" => "-",
            "name" => "Toxic Parent",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 317,
            "code" => "-",
            "name" => "Trauma",
            "sub_category_id" => 29,
            "price" => 12
        ],
        [
            "id" => 318,
            "code" => "-",
            "name" => "Uliiiii",
            "sub_category_id" => 29,
            "price" => 10
        ],
        [
            "id" => 319,
            "code" => "-",
            "name" => "Vanilla Cat",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 320,
            "code" => "-",
            "name" => "Von Pferd und Bär",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 321,
            "code" => "-",
            "name" => "Von Rin",
            "sub_category_id" => 29,
            "price" => 13
        ],
        [
            "id" => 322,
            "code" => "-",
            "name" => "Wanna Play",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 323,
            "code" => "-",
            "name" => "Wrong Way to make Pina Colada",
            "sub_category_id" => 29,
            "price" => 11
        ],
        [
            "id" => 324,
            "code" => "-",
            "name" => "Xi Muoi",
            "sub_category_id" => 29,
            "price" => 12
        ],
    ];

    private $defaultCategories = [
        ["id" => 1, "name" => 'Speisen', "priority" => 1],
        ["id" => 2, "name" => 'Cocktail', "priority" => 2],
        ["id" => 3, "name" => 'Wasser', "priority" => 6],
        ["id" => 4, "name" => 'Hausgemachte Getränke', "priority" => 4],
        ["id" => 5, "name" => 'Softdrink', "priority" => 8],
        ["id" => 6, "name" => 'Mocktail', "priority" => 7],
        ["id" => 7, "name" => 'Säfte & Necktare', "priority" => 9],
        ["id" => 8, "name" => 'Heiße Getränke', "priority" => 3],
        ["id" => 9, "name" => 'Bier', "priority" => 5],
        ["id" => 10, "name" => 'Wein', "priority" => 10],
        ["id" => 11, "name" => 'Prosecco', "priority" => 11],
        ["id" => 12, "name" => 'Sonstiges', "priority" => 12],
    ];

    private $defaultSubCategories = [
        ["id" => 1, "name" => 'Salate', "category_id" => 1],
        ["id" => 2, "name" => 'Süppchen', "category_id" => 1],
        ["id" => 3, "name" => 'Tapas', "category_id" => 1],
        ["id" => 4, "name" => 'Bao Buns', "category_id" => 1],
        ["id" => 5, "name" => 'Reis - Nudeln', "category_id" => 1],
        ["id" => 6, "name" => 'Suppen', "category_id" => 1],
        ["id" => 9, "name" => 'Süßes', "category_id" => 1],
        // [ id=> 11, "name"=> 'Alle', "category_id"=> 2 ],
        ["id" => 12, "name" => 'Alle', "category_id" => 3],
        ["id" => 13, "name" => 'Limo', "category_id" => 4],
        ["id" => 8, "name" => 'Eistee', "category_id" => 4],
        ["id" => 14, "name" => 'Alle', "category_id" => 5],
        ["id" => 15, "name" => 'Alle', "category_id" => 6],
        ["id" => 16, "name" => 'Alle', "category_id" => 7],
        ["id" => 17, "name" => 'Kaffee', "category_id" => 8],
        ["id" => 18, "name" => 'Tee', "category_id" => 8],
        ["id" => 19, "name" => 'Auf Güsse', "category_id" => 8],
        ["id" => 20, "name" => 'Alle', "category_id" => 9],
        ["id" => 21, "name" => 'Alle', "category_id" => 10],
        ["id" => 22, "name" => 'Alle', "category_id" => 11],
        ["id" => 23, "name" => 'Snacks', "category_id" => 12],
        ["id" => 24, "name" => 'Unbekannt', "category_id" => 12],
        // COCKTAILS SUBCAT
        ["id" => 25, "name" => 'Flight Cocktails (Set)', "category_id" => 2],
        ["id" => 26, "name" => 'Spritz / Spizz', "category_id" => 2],
        ["id" => 27, "name" => 'Negroni', "category_id" => 2],
        ["id" => 28, "name" => 'alte & neue Klassiker', "category_id" => 2],
        ["id" => 29, "name" => 'SIGNATURE', "category_id" => 2],
    ];

    private $defaultTables = [
        ["id" => 1, "name" => 'Table 1', "type" => 1],
        ["id" => 2, "name" => 'Table 2', "type" => 1],
        ["id" => 3, "name" => 'Table 3', "type" => 1],
        ["id" => 4, "name" => 'Table 4', "type" => 1],
        ["id" => 5, "name" => 'Table 5', "type" => 1],
        ["id" => 6, "name" => 'Table 6', "type" => 1],
        ["id" => 7, "name" => 'Table 7', "type" => 1],
        ["id" => 8, "name" => 'Table 8', "type" => 1],
        ["id" => 9, "name" => 'Table 9', "type" => 1],
        ["id" => 10, "name" => 'Table 10', "type" => 1],
        ["id" => 11, "name" => 'Table 11', "type" => 2],
        ["id" => 12, "name" => 'Table 12', "type" => 2],
        ["id" => 13, "name" => 'Table 13', "type" => 2],
        ["id" => 14, "name" => 'Table 14', "type" => 2],
        ["id" => 15, "name" => 'Table 15', "type" => 2],
        ["id" => 16, "name" => 'Table 16', "type" => 2],
        ["id" => 17, "name" => 'Table 17', "type" => 2],
        ["id" => 18, "name" => 'Table 18', "type" => 2],
        ["id" => 19, "name" => 'Table 19', "type" => 2],
        ["id" => 20, "name" => 'Table 20', "type" => 2],
        ["id" => 21, "name" => 'Table 21', "type" => 3],
        ["id" => 22, "name" => 'Table 22', "type" => 3],
        ["id" => 23, "name" => 'Table 23', "type" => 3],
    ];

    public function run(): void
    {
        DB::connection('mysql_waiter')->table('tables')->insert($this->defaultTables);
        DB::connection('mysql_waiter')->table('categories')->insert($this->defaultCategories);
        DB::connection('mysql_waiter')->table('sub_categories')->insert($this->defaultSubCategories);
        DB::connection('mysql_waiter')->table('items')->insert($this->defaultItems);
    }
}
