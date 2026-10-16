"""Descriptor checks use generated test signals, without downloading or redistributing reference music."""
import importlib.util
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('references',Path(__file__).with_name('analyze-references.py'))
references=importlib.util.module_from_spec(spec);spec.loader.exec_module(references)
np=references.np

class Descriptors(unittest.TestCase):
    def test_silence_has_no_invented_key_or_pulse(self):
        result=references.analyze(np.zeros(references.RATE*5,dtype=np.float32))
        self.assertEqual(result['keyCandidates'],[]);self.assertEqual(result['pulseCandidates'],[])
        self.assertEqual(result['dynamicsDb'],0);self.assertEqual(result['peak'],0)

    def test_known_pulse_retains_octave_ambiguity_and_range(self):
        signal=np.zeros(references.RATE*20,dtype=np.float32)
        burst=np.sin(np.arange(800)*2*np.pi*600/references.RATE)*np.exp(-np.arange(800)/170)
        for at in np.arange(0,20,.5):
            start=round(at*references.RATE);signal[start:start+len(burst)]+=burst[:len(signal)-start]
        result=references.analyze(signal)
        self.assertTrue(any(abs(item['bpm']-120)<5 or abs(item['bpm']-60)<3 for item in result['pulseCandidates']))
        self.assertTrue(all(40<=item['bpm']<=180 for item in result['pulseCandidates']))

    def test_pitched_triad_has_finite_normalized_pitch_profile(self):
        time=np.arange(references.RATE*6)/references.RATE
        signal=sum(np.sin(2*np.pi*frequency*time) for frequency in [261.626,329.628,391.995])*.1
        result=references.analyze(signal)
        self.assertAlmostEqual(sum(result['pitchClasses']),1,places=3)
        strongest=set(np.argsort(result['pitchClasses'])[-3:].tolist())
        self.assertEqual(strongest,{0,4,7});self.assertTrue(result['keyCandidates'])
        with self.assertRaises(ValueError):references.analyze(np.array([np.nan]*5000))

if __name__=='__main__':
    references.wait_memory();unittest.main()
