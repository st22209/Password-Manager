const argon2 = require("argon2")
const each = require("jest-each").default

describe("saltWorking", () => {
    each([
        [
            "5wgb3n1Yvha7NfYtX2Jw",
            "$argon2id$v=19$m=65536,t=3,p=4$jyUySZ7b+aTto0ooEpI06Q$4Lkl/X+aBNCyNdPQixu4b1WNhHfD+wLPIUWBwIpkZMA",
        ],
        [
            "L6ZRvqySgCNfOXWmNCRG",
            "$argon2id$v=19$m=65536,t=3,p=4$cLwbSVis6bjK9OcqeYVgsw$3DHan80bCz40rXLHoVqQ0beNF8sQcF+CLEiOBz4SZmk",
        ],
        [
            "oaJxeR44mu6k",
            "$argon2id$v=19$m=65536,t=3,p=4$Qu71mRRzdT4q7dWKLovQNQ$z7mBs4twfWcSuITPFj2cuDpqzYs6SlUM/8IgilDhBj4",
        ],
        [
            "7O2BUZD5Gl5i",
            "$argon2id$v=19$m=65536,t=3,p=4$6cmwm5cj/PdatY34uDhFWQ$YIK4k0Z2ukURMkcQ6e4Ip1kb0DwJm6KzNfeEIhEFkYE",
        ],
        [
            "jL42qxVNphhxKeP",
            "$argon2id$v=19$m=65536,t=3,p=4$mFu8f9XJMlj5aJlb5RKzjw$m5bwnVhn3FEcDQsio/vJBN2zzBFtDoq09eRWybaMQYI",
        ],
        [
            "M2zuVRclH1ACiGumuMRrdSvbh30",
            "$argon2id$v=19$m=65536,t=3,p=4$zUGmKhayL2e44bXapoVSZQ$T2HMTvO/Ly/ekWg7g+BRQAvKCMTJ5rQ3J5D1CA6MwdY",
        ],
        [
            "eDUPcdHUG9jxSGkfg61",
            "$argon2id$v=19$m=65536,t=3,p=4$w0rddBQVyX2O9BqaaLRCAg$tQpU2w6BvAACneq5GDIz0VN2EUDCI6wlaGNdp9SjbP8",
        ],
        [
            "r0VXwa3OtwrAK0E6n0a4ai",
            "$argon2id$v=19$m=65536,t=3,p=4$xpy1Xv8ytA+X7mMHOfMRLA$ZvjcdLqrivSZrVoCV3+3uktEoauccDb5VO7fS0oZqnA",
        ],
        [
            "ze8rHkXMFtg5qW7LW9ibGYT5XamqtV",
            "$argon2id$v=19$m=65536,t=3,p=4$Foz1TR2cnkE087TYhWKiUQ$j2ONdwpwvVK9Kh2hMyMW+PU62QAAU7RG45vFGQ2msx8",
        ],
        [
            "PCFKvIwuChekZGPEYR",
            "$argon2id$v=19$m=65536,t=3,p=4$x5ZNBHs/+2pPjLYaa7mIyw$TxoeHRz1p7L7OmE//Y+M8xqaKVTyMV7NI3I3hGevoQQ",
        ],
        [
            "R32AejqjOhtyL5",
            "$argon2id$v=19$m=65536,t=3,p=4$dMSLs8pVx4vupoaPnJkE4A$k1g7oR5SaEulnOGKk7zS60ed0w02tB5ztjzw6sOXbAs",
        ],
        [
            "8DMGyn0oVhGBydgVZbz5KuEu7ix",
            "$argon2id$v=19$m=65536,t=3,p=4$5+2KCtZLZ8bEGku1x3zzLw$byN6A1OXg55GidkP51Q7C22RTM4emODfeYR/XwTIJNw",
        ],
        [
            "Qa5pIhMmjdWZOELEoU8Zp",
            "$argon2id$v=19$m=65536,t=3,p=4$VUbJBheBfKBSj5VVNDh1VQ$f7j241Da39/GaffHFIgXwrPnI6DFuj8O4D6nIHTjfiY",
        ],
        [
            "g13c4RcFyAMb",
            "$argon2id$v=19$m=65536,t=3,p=4$H0M7hyNQQwaBHYl1+iWJZQ$g2SvMZtloe4kzLyKw+nFvgb9RFVM8xo6pGanTs61U+8",
        ],
        [
            "viItKczZrcWJ2q0Q0ZMXhmrRNG0",
            "$argon2id$v=19$m=65536,t=3,p=4$yKmo4DIzdb75Z11+8d1oQw$izIxFiVgPsNelFE6hoTWp+7yDX3Fwiz/xOlFUTZfjds",
        ],
    ]).it("when the input is '%s'", async (text, expected) => {
        // extract salt from hash
        let salt = expected.split("$")[4]

        // hash with extracted salt
        let hashed = await argon2.hash(text, {
            salt: Buffer.from(salt, "base64"),
        })

        // check if both are equivilent
        expect(hashed).toBe(expected)
    })
})
