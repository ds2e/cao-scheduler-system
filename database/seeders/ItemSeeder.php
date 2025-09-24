<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemSeeder extends Seeder
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
            "category_id" => 14,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 2,
            "code" => "2",
            "name" => "Konfetti (Bio Tofu)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 7.5
        ],
        [
            "id" => 3,
            "code" => "3",
            "name" => "Konfetti (gegrilltes Hähnchen)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 9.5
        ],
        [
            "id" => 4,
            "code" => "4",
            "name" => "Konfetti (Lachs)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 6,
            "code" => "5",
            "name" => "Der Gewickelte (Bio Tofu)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 7,
            "code" => "6",
            "name" => "Der Gewickelte (Hähnchenbrust)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 8,
            "code" => "7",
            "name" => "Der Gewickelte (Garnelen)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 9,
            "code" => "8",
            "name" => "Der Gewickelte (Wakame)",
            "category_id" => 14,
            "item_class" => 2,
            "price" => 7
        ],
        // Süppchen
        [
            "id" => 10,
            "code" => "11",
            "name" => "Miso",
            "category_id" => 15,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 11,
            "code" => "12",
            "name" => "Sauer - Scharf",
            "category_id" => 15,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 12,
            "code" => "13",
            "name" => "Teigtasche Suppe (Gemüse | Vegan)",
            "category_id" => 15,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 13,
            "code" => "14",
            "name" => "Teigtasche Suppe (Hähnchen)",
            "category_id" => 15,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 14,
            "code" => "15",
            "name" => "Teigtasche Suppe (Garnelen)",
            "category_id" => 15,
            "item_class" => 2,
            "price" => 6.5
        ],
        // TAPAS
        [
            "id" => 15,
            "code" => "20",
            "name" => "Gemüse Stick",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 16,
            "code" => "21",
            "name" => "Cha Gio Chay",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 17,
            "code" => "22",
            "name" => "Dreiecken",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 18,
            "code" => "23",
            "name" => "vegane Teigtaschen",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 19,
            "code" => "24",
            "name" => "Hähnchen Teigtaschen",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 20,
            "code" => "25",
            "name" => "Garnelen Teigtaschen",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 21,
            "code" => "26",
            "name" => "Ebi Fry",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 22,
            "code" => "27",
            "name" => "Cha Gio",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 23,
            "code" => "28",
            "name" => "Money Bags",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 24,
            "code" => "29",
            "name" => "Spiessee",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 25,
            "code" => "30",
            "name" => "Erdapffel",
            "category_id" => 16,
            "item_class" => 2,
            "price" => 8
        ],
        // BAO BUNS
        [
            "id" => 26,
            "code" => "31",
            "name" => "Vegan Cáo",
            "category_id" => 17,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 27,
            "code" => "32",
            "name" => "Cheeky Buns",
            "category_id" => 17,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 28,
            "code" => "33",
            "name" => "Nice To Meat You",
            "category_id" => 17,
            "item_class" => 2,
            "price" => 19
        ],
        [
            "id" => 29,
            "code" => "34",
            "name" => "Shrimply Tempura",
            "category_id" => 17,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 30,
            "code" => "35",
            "name" => "Fish Lover",
            "category_id" => 17,
            "item_class" => 2,
            "price" => 16
        ],
        // REIS - NUDELN
        [
            "id" => 31,
            "code" => "40",
            "name" => "Curry (Bio Tofu | Vegan)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 32,
            "code" => "41",
            "name" => "Curry (Hähnchen)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 16
        ],
        [
            "id" => 33,
            "code" => "42",
            "name" => "Canh Chua (Lachs)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 22
        ],
        [
            "id" => 34,
            "code" => "43",
            "name" => "Canh Chua (Garnelen in weizen Teigmantel)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 35,
            "code" => "44",
            "name" => "Nudelsalat - Lauwarm (Bio Tofu)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 36,
            "code" => "45",
            "name" => "gegrilltes Hähnchen",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 37,
            "code" => "46",
            "name" => "Bun Nem (Gemüse | Vegan | Glutenhaltig)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 38,
            "code" => "47",
            "name" => "Bun Nem (Schweinefleisch - Gemüse)",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 18
        ],
        [
            "id" => 39,
            "code" => "48",
            "name" => "Yaki Udon",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 40,
            "code" => "49",
            "name" => "Bun Cha",
            "category_id" => 18,
            "item_class" => 2,
            "price" => 19
        ],
        // SUPPEN
        [
            "id" => 41,
            "code" => "50",
            "name" => "Bun Tom Yum (Bio Tofu)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 42,
            "code" => "51",
            "name" => "Bun Tom Yum (mit Garnelen)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 43,
            "code" => "52",
            "name" => "Coco Easy (Bio Tofu | Vegan)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 44,
            "code" => "53",
            "name" => "Coco Easy (Hähnchen)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 16
        ],
        [
            "id" => 45,
            "code" => "54",
            "name" => "Coco Easy (Garnelen)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 17
        ],
        [
            "id" => 46,
            "code" => "55",
            "name" => "Ramen (mariniertes Schweinefleisch)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 18
        ],
        [
            "id" => 47,
            "code" => "56",
            "name" => "Ramen (mariniertes Schweinefleisch)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 22
        ],
        [
            "id" => 49,
            "code" => "57",
            "name" => "Phö (Bio Tofu | Gemüse | Vegan)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 16
        ],
        [
            "id" => 51,
            "code" => "58",
            "name" => "Phö (Hähnchen)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 16
        ],
        [
            "id" => 52,
            "code" => "59",
            "name" => "Phö (Rindfleisch)",
            "category_id" => 19,
            "item_class" => 2,
            "price" => 18
        ],
        // SÜSSES
        [
            "id" => 53,
            "code" => "61",
            "name" => "Die Leberwurst (Vegan)",
            "category_id" => 20,
            "item_class" => 2,
            "price" => 6.5
        ],
        [
            "id" => 54,
            "code" => "62",
            "name" => "Reimaco (Vegan)",
            "category_id" => 20,
            "item_class" => 2,
            "price" => 7
        ],
        [
            "id" => 55,
            "code" => "63",
            "name" => "Green Soul",
            "category_id" => 20,
            "item_class" => 2,
            "price" => 7
        ],
        [
            "id" => 57,
            "code" => "64",
            "name" => "Tropi-Call (Vegan)",
            "category_id" => 20,
            "item_class" => 2,
            "price" => 6.5
        ],
        // GETRÄNKE
        // WASSER
        [
            "id" => 59,
            "code" => "-",
            "name" => "Wasser (0.25l)",
            "category_id" => 5,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 61,
            "code" => "-",
            "name" => "Wasser (0.75l)",
            "category_id" => 5,
            "item_class" => 2,
            "price" => 7
        ],
        // HAUSGEMACHT
        // LIMO
        [
            "id" => 63,
            "code" => "-",
            "name" => "Gurke-Basilikum",
            "category_id" => 26,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 64,
            "code" => "-",
            "name" => "Hibiskus",
            "category_id" => 26,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 65,
            "code" => "-",
            "name" => "Minze - Limetten",
            "category_id" => 26,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 66,
            "code" => "-",
            "name" => "Safran - Mango - Chili",
            "category_id" => 26,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 67,
            "code" => "-",
            "name" => "Zitronengras - Ingwer",
            "category_id" => 26,
            "item_class" => 2,
            "price" => 6
        ],
        // EISTEE
        [
            "id" => 68,
            "code" => "-",
            "name" => "Granatapfel",
            "category_id" => 27,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 70,
            "code" => "-",
            "name" => "Himbeere",
            "category_id" => 27,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 71,
            "code" => "-",
            "name" => "Holunder",
            "category_id" => 27,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 72,
            "code" => "-",
            "name" => "Litchi",
            "category_id" => 27,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 73,
            "code" => "-",
            "name" => "Mango",
            "category_id" => 27,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 74,
            "code" => "-",
            "name" => "Pfirsich",
            "category_id" => 27,
            "item_class" => 2,
            "price" => 6
        ],
        // SOFTDRINK
        [
            "id" => 75,
            "code" => "-",
            "name" => "Pepsi / Pepsi Zero",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 76,
            "code" => "-",
            "name" => "7Up",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 77,
            "code" => "-",
            "name" => "Orange Schwip Schwap",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 78,
            "code" => "-",
            "name" => "Bitter Lemon",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 79,
            "code" => "-",
            "name" => "Ginger Ale",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 80,
            "code" => "-",
            "name" => "Spicy Ginger",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 94,
            "code" => "-",
            "name" => "Tonic Water",
            "category_id" => 7,
            "item_class" => 2,
            "price" => 3
        ],
        // MOCK TAILS
        [
            "id" => 95,
            "code" => "-",
            "name" => "Cori's F.S.C",
            "category_id" => 8,
            "item_class" => 2,
            "price" => 7.5
        ],
        [
            "id" => 96,
            "code" => "-",
            "name" => "Lindas Unschuld",
            "category_id" => 8,
            "item_class" => 2,
            "price" => 7.5
        ],
        [
            "id" => 97,
            "code" => "-",
            "name" => "Mingwar",
            "category_id" => 8,
            "item_class" => 2,
            "price" => 7.5
        ],
        [
            "id" => 98,
            "code" => "-",
            "name" => "Thyme On Ice",
            "category_id" => 8,
            "item_class" => 2,
            "price" => 7.5
        ],
        [
            "id" => 99,
            "code" => "-",
            "name" => "Tweetea",
            "category_id" => 8,
            "item_class" => 2,
            "price" => 7.5
        ],
        // SÄFTE
        [
            "id" => 100,
            "code" => "-",
            "name" => "Ananassaft",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 101,
            "code" => "-",
            "name" => "Apfelsaft-Naturtrüb",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 102,
            "code" => "-",
            "name" => "Bananen Nektar",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 103,
            "code" => "-",
            "name" => "Cranberry Nektar",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 104,
            "code" => "-",
            "name" => "Grapefruitsaft",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 105,
            "code" => "-",
            "name" => "Mango Nektar",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 106,
            "code" => "-",
            "name" => "Maracuja Nektar",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 107,
            "code" => "-",
            "name" => "Orangensaft",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 108,
            "code" => "-",
            "name" => "Sauerkirsch Nektar",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 3
        ],
        [
            "id" => 109,
            "code" => "-",
            "name" => "Kiba",
            "category_id" => 9,
            "item_class" => 2,
            "price" => 5.5
        ],
        // HEIße GETRÄNKE
        // KAFFEE
        [
            "id" => 110,
            "code" => "-",
            "name" => "Vietnamesischer Filterkaffee (ohne Kondensmilch)",
            "category_id" => 28,
            "item_class" => 2,
            "price" => 4.5
        ],
        [
            "id" => 111,
            "code" => "-",
            "name" => "Vietnamesischer Filterkaffee (mit Kondensmilch)",
            "category_id" => 28,
            "item_class" => 2,
            "price" => 5.5
        ],
        [
            "id" => 112,
            "code" => "-",
            "name" => "Ca Phe Muoi",
            "category_id" => 28,
            "item_class" => 2,
            "price" => 6.5
        ],
        // TEE
        [
            "id" => 113,
            "code" => "-",
            "name" => "Grüner Tee (normal)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 114,
            "code" => "-",
            "name" => "Grüner Tee (Jasmin)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 115,
            "code" => "-",
            "name" => "Grüner Tee (Apfel-Cocos)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 116,
            "code" => "-",
            "name" => "Grüner Tee (Orange-Zimt)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 117,
            "code" => "-",
            "name" => "Grüner Tee (gerösteter Reis)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 118,
            "code" => "-",
            "name" => "Schwazer Tee (normal)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 119,
            "code" => "-",
            "name" => "Schwazer Tee (normal)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 120,
            "code" => "-",
            "name" => "Schwazer Tee (Rose)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 122,
            "code" => "-",
            "name" => "Schwazer Tee (Minze)",
            "category_id" => 29,
            "item_class" => 2,
            "price" => 5
        ],
        // AUF GÜSSE
        [
            "id" => 123,
            "code" => "-",
            "name" => "Ingwer-Limette-Minze",
            "category_id" => 30,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 124,
            "code" => "-",
            "name" => "Minze",
            "category_id" => 30,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 125,
            "code" => "-",
            "name" => "Salbei-Orange",
            "category_id" => 30,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 126,
            "code" => "-",
            "name" => "Zitronengras-Limette",
            "category_id" => 30,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 127,
            "code" => "-",
            "name" => "Yuzu",
            "category_id" => 30,
            "item_class" => 2,
            "price" => 5
        ],
        // BIERE
        [
            "id" => 128,
            "code" => "-",
            "name" => "Allgäuer Büble (helles)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 129,
            "code" => "-",
            "name" => "Allgäuer Büble (weizen)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 130,
            "code" => "-",
            "name" => "Ritterguts Gose (ohne Sirup)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 131,
            "code" => "-",
            "name" => "Ritterguts Gose (mit Sirup)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 6
        ],
        [
            "id" => 134,
            "code" => "-",
            "name" => "Staropramen (Lager)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 4
        ],
        [
            "id" => 135,
            "code" => "-",
            "name" => "Staropramen (Dark)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 136,
            "code" => "-",
            "name" => "Allgäuer Büble (weizen | Alkoholfrei)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 5
        ],
        [
            "id" => 137,
            "code" => "-",
            "name" => "Jever Fun (Alkoholfrei)",
            "category_id" => 11,
            "item_class" => 2,
            "price" => 4
        ],
        // WEIN
        [
            "id" => 138,
            "code" => "-",
            "name" => "Rivaner-Grauer Burgunder",
            "category_id" => 12,
            "item_class" => 2,
            "price" => 7
        ],
        [
            "id" => 139,
            "code" => "-",
            "name" => "Riesling",
            "category_id" => 12,
            "item_class" => 2,
            "price" => 7
        ],
        [
            "id" => 140,
            "code" => "-",
            "name" => "Oppenheimer Krötenbrunnen",
            "category_id" => 12,
            "item_class" => 2,
            "price" => 7
        ],
        [
            "id" => 141,
            "code" => "-",
            "name" => "Spätburgunder",
            "category_id" => 12,
            "item_class" => 2,
            "price" => 7
        ],
        [
            "id" => 142,
            "code" => "-",
            "name" => "Rose D'Anjou",
            "category_id" => 12,
            "item_class" => 2,
            "price" => 7
        ],
        // PROSECCO
        [
            "id" => 143,
            "code" => "-",
            "name" => "Valdobbiadene Superiore",
            "category_id" => 13,
            "item_class" => 2,
            "price" => 6
        ],
        // SONSTIGES 
        // (SNACK / BEILAGE)
        [
            "id" => 145,
            "code" => "-",
            "name" => "Bar-Snacks",
            "category_id" => 31,
            "item_class" => 2,
            "price" => 7
        ],
        // COCKTAILS
        // FLIGHT SET
        [
            "id" => 146,
            "code" => "A",
            "name" => "Set A",
            "category_id" => 21,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 147,
            "code" => "B",
            "name" => "Set B",
            "category_id" => 21,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 148,
            "code" => "AB",
            "name" => "Set AB",
            "category_id" => 21,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 149,
            "code" => "0",
            "name" => "Set 0",
            "category_id" => 21,
            "item_class" => 2,
            "price" => 15
        ],
        // SPRITZ/SPIZZ
        [
            "id" => 150,
            "code" => "Aperol",
            "name" => "Spritz",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 152,
            "code" => "Campari",
            "name" => "Amalfi",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 153,
            "code" => "Campari",
            "name" => "Spritz",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9.5
        ],
        [
            "id" => 154,
            "code" => "Crondino",
            "name" => "Spritz",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 7.5
        ],
        [
            "id" => 155,
            "code" => "Limoncello",
            "name" => "Basillino",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 156,
            "code" => "Limoncello",
            "name" => "Spritz",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 157,
            "code" => "Limoncello",
            "name" => "Tonic",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 158,
            "code" => "Pampelle",
            "name" => "Rose",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 159,
            "code" => "Pampelle",
            "name" => "Spritz",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 160,
            "code" => "Pampelle",
            "name" => "Tonic",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 161,
            "code" => "Solrosa",
            "name" => "Spritz",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        [
            "id" => 162,
            "code" => "Solrosa",
            "name" => "Tonic",
            "category_id" => 22,
            "item_class" => 2,
            "price" => 9
        ],
        // NEGRONI
        [
            "id" => 163,
            "code" => "-",
            "name" => "Der Grossvater",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 164,
            "code" => "-",
            "name" => "Der Klassiker",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 165,
            "code" => "-",
            "name" => "Der Mexikaner",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 167,
            "code" => "-",
            "name" => "Der Sanfte",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 168,
            "code" => "-",
            "name" => "Der Schokoladen Twist",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 169,
            "code" => "-",
            "name" => "Der Seltsame",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 170,
            "code" => "-",
            "name" => "Der Spritzige",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 171,
            "code" => "-",
            "name" => "Der Würzige",
            "category_id" => 23,
            "item_class" => 2,
            "price" => 11
        ],
        // ALTE UND NEUE KLASSIKER
        [
            "id" => 172,
            "code" => "-",
            "name" => "Alt Modisch",
            "category_id" => 24,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 173,
            "code" => "-",
            "name" => "ErwachsenenFilm-Darsteller Martini",
            "category_id" => 24,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 174,
            "code" => "-",
            "name" => "Gänseblümchen",
            "category_id" => 24,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 176,
            "code" => "-",
            "name" => "Wachmacher Martini",
            "category_id" => 24,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 178,
            "code" => "-",
            "name" => "Saures Wasser Des Lebens",
            "category_id" => 24,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 179,
            "code" => "-",
            "name" => "Schmerztöter",
            "category_id" => 24,
            "item_class" => 2,
            "price" => 12
        ],
        // SIGNATURE
        [
            "id" => 180,
            "code" => "-",
            "name" => "A Bitter Longing",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 181,
            "code" => "-",
            "name" => "Basis Bitch",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 182,
            "code" => "-",
            "name" => "Beischlaf am Strand",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 184,
            "code" => "-",
            "name" => "Bitter Boris",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 185,
            "code" => "-",
            "name" => "Bose Winter Traum",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 186,
            "code" => "-",
            "name" => "Breakfast Gang",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 187,
            "code" => "-",
            "name" => "Briegelinho",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 188,
            "code" => "-",
            "name" => "Bürohengst",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 189,
            "code" => "-",
            "name" => "Cocoyashi Village",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 190,
            "code" => "-",
            "name" => "Cold Hand Warm Heart",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 191,
            "code" => "-",
            "name" => "Danger Kitty",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 192,
            "code" => "-",
            "name" => "Das Versprechen",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 193,
            "code" => "-",
            "name" => "Der C.T.",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 196,
            "code" => "-",
            "name" => "Der Gelbe Bikini",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 197,
            "code" => "-",
            "name" => "Die E-Feee",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 198,
            "code" => "-",
            "name" => "Disorder",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 199,
            "code" => "-",
            "name" => "Domino",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 200,
            "code" => "-",
            "name" => "Donauwelle",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 201,
            "code" => "-",
            "name" => "Dr. Wolle's Hustensaft",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 202,
            "code" => "-",
            "name" => "Dừa",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 274,
            "code" => "-",
            "name" => "Duftmarke",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 275,
            "code" => "-",
            "name" => "Dugong",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 276,
            "code" => "-",
            "name" => "Einhornblut",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 277,
            "code" => "-",
            "name" => "Electric Lilac",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 278,
            "code" => "-",
            "name" => "Feierabend Fanta",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 279,
            "code" => "-",
            "name" => "Fette Elfe",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 280,
            "code" => "-",
            "name" => "Garfield hates Mondays",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 281,
            "code" => "-",
            "name" => "Glitzil - Litzil",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 282,
            "code" => "-",
            "name" => "Grün ist meine Lieblingsfarbe",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 283,
            "code" => "-",
            "name" => "Gurkensalat",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 284,
            "code" => "-",
            "name" => "Gute Aussicht",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 285,
            "code" => "-",
            "name" => "Herrgottbescheisserle",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 286,
            "code" => "-",
            "name" => "Hubba Bubba",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 287,
            "code" => "-",
            "name" => "Iris lässt dich bluten",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 288,
            "code" => "-",
            "name" => "Isaac",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 13
        ],
        [
            "id" => 289,
            "code" => "-",
            "name" => "K.T.N.",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 15
        ],
        [
            "id" => 290,
            "code" => "-",
            "name" => "Kanginsky",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 291,
            "code" => "-",
            "name" => "Kräuter Thomas",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 292,
            "code" => "-",
            "name" => "Läster Schwester",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 293,
            "code" => "-",
            "name" => "Lindas Einstieg",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 294,
            "code" => "-",
            "name" => "Lindas Melone",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 295,
            "code" => "-",
            "name" => "Lindas Untergang",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 296,
            "code" => "-",
            "name" => "Litch mir einen Punkt",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 297,
            "code" => "-",
            "name" => "Lotterleben",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 298,
            "code" => "-",
            "name" => "Milchreis",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 299,
            "code" => "-",
            "name" => "Milenka",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 300,
            "code" => "-",
            "name" => "Moody Morals",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 301,
            "code" => "-",
            "name" => "Muh Porn",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 302,
            "code" => "-",
            "name" => "Nee, Mach mal ohne Creme, sonst kotz ich",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 303,
            "code" => "-",
            "name" => "Nika Dynamite",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 304,
            "code" => "-",
            "name" => "Paradies of broken Dreams",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 305,
            "code" => "-",
            "name" => "Perfect Angel",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 306,
            "code" => "-",
            "name" => "Pilzrisotto",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 307,
            "code" => "-",
            "name" => "Ponyo",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 308,
            "code" => "-",
            "name" => "Q, weil es noch fehlte",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 309,
            "code" => "-",
            "name" => "Rosee Pamplemousse",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 310,
            "code" => "-",
            "name" => "Schoko Katze",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 311,
            "code" => "-",
            "name" => "Shiso Smash",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 312,
            "code" => "-",
            "name" => "Spanish Rose",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 313,
            "code" => "-",
            "name" => "Sparky on the Beach",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 314,
            "code" => "-",
            "name" => "Soft Cake",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 315,
            "code" => "-",
            "name" => "The Smile of Josephine",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 203,
            "code" => "-",
            "name" => "Tiramisu",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 316,
            "code" => "-",
            "name" => "Toxic Parent",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 317,
            "code" => "-",
            "name" => "Trauma",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
        [
            "id" => 318,
            "code" => "-",
            "name" => "Uliiiii",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 10
        ],
        [
            "id" => 319,
            "code" => "-",
            "name" => "Vanilla Cat",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 320,
            "code" => "-",
            "name" => "Von Pferd und Bär",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 321,
            "code" => "-",
            "name" => "Von Rin",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 13
        ],
        [
            "id" => 322,
            "code" => "-",
            "name" => "Wanna Play",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 323,
            "code" => "-",
            "name" => "Wrong Way to make Pina Colada",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 11
        ],
        [
            "id" => 324,
            "code" => "-",
            "name" => "Xi Muoi",
            "category_id" => 25,
            "item_class" => 2,
            "price" => 12
        ],
    ];

    public function run(): void
    {
        DB::connection('mysql_waiter')->table('items')->insert($this->defaultItems);
    }
}
